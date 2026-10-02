import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import i18n from '../i18n';
import { api } from '../api/client';
import { session } from '../api/session';
import { useSession } from '../api/hooks';
import { clearQueue } from '../features/attendance/offlineQueue';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const s = useSession();
  const qc = useQueryClient();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(Boolean(s.accessToken));

  const applyMe = useCallback((user) => {
    setMe(user);
    const current = user.schools.find((x) => x.id === session.get().schoolId) || user.schools.find((x) => x.isDefault) || user.schools[0];
    session.set({ schoolId: current?.id ?? null });
    const lng = user.preferredLanguage || session.get().language || current?.defaultLanguage;
    if (lng && lng !== i18n.language) i18n.changeLanguage(lng);
  }, []);

  const refreshMe = useCallback(async () => {
    const { data } = await api.get('/me');
    applyMe(data);
    return data;
  }, [applyMe]);

  // Load the profile once per token; a missing token (logout/expiry) is derived below, not stored.
  useEffect(() => {
    if (!s.accessToken || me) return;
    api
      .get('/me')
      .then(({ data }) => applyMe(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [s.accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(
    async (identifier, password) => {
      const { data } = await api.post('/auth/login', { identifier, password });
      session.set({ accessToken: data.accessToken, refreshToken: data.refreshToken, logoutReason: null, yearId: null });
      applyMe(data.user);
      // First login: remember the language chosen on the login screen.
      if (!data.user.preferredLanguage) api.patch('/me', { preferredLanguage: i18n.language }).catch(() => {});
      return data.user;
    },
    [applyMe],
  );

  const logout = useCallback(async () => {
    const { refreshToken } = session.get();
    api.post('/auth/logout', { refreshToken }).catch(() => {});
    session.clear();
    qc.clear();
    setMe(null);
    // Shared phones: remove children's data kept for offline use.
    await clearQueue();
    if (typeof caches !== 'undefined') await caches.delete('api-read').catch(() => {});
  }, [qc]);

  const switchSchool = useCallback(
    (schoolId) => {
      session.set({ schoolId, yearId: null });
      qc.clear();
    },
    [qc],
  );

  const value = useMemo(() => {
    const user = s.accessToken ? me : null;
    const school = user?.schools.find((x) => x.id === s.schoolId) || null;
    return { me: user, school, role: school?.role, loading: Boolean(s.accessToken) && !me && loading, login, logout, refreshMe, applyMe, switchSchool };
  }, [me, s.accessToken, s.schoolId, loading, login, logout, refreshMe, applyMe, switchSchool]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
