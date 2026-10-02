import axios from 'axios';
import { session } from './session';

export const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api/v1`;

export const http = axios.create({ baseURL: API_BASE, timeout: 30000 });

http.interceptors.request.use((config) => {
  const s = session.get();
  if (s.accessToken) config.headers.Authorization = `Bearer ${s.accessToken}`;
  if (s.schoolId) config.headers['X-School-Id'] = s.schoolId;
  if (s.yearId && !config.headers['X-Academic-Year']) config.headers['X-Academic-Year'] = s.yearId;
  if (s.language) config.headers['Accept-Language'] = s.language;
  return config;
});

// One refresh at a time; concurrent 401s wait for it.
let refreshing = null;
async function refreshTokens() {
  const { refreshToken } = session.get();
  if (!refreshToken) throw new Error('no refresh token');
  const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
  session.set({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
}

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (response?.status === 401 && !config._retried && session.get().refreshToken) {
      config._retried = true;
      const before = session.get().refreshToken;
      try {
        refreshing = refreshing || refreshTokens().finally(() => (refreshing = null));
        await refreshing;
        return http(config);
      } catch {
        // Another tab may have refreshed at the same moment: use its new tokens instead of logging out.
        if (session.get().refreshToken && session.get().refreshToken !== before) return http(config);
        session.clear('SESSION_EXPIRED');
      }
    } else if (response?.status === 401 && session.get().accessToken) {
      session.clear('SESSION_EXPIRED');
    }
    return Promise.reject(normalize(error));
  },
);

// Every error becomes { code, params, fields, status } so screens can translate it.
export function normalize(error) {
  const e = new Error(error.message);
  const body = error.response?.data?.error;
  e.status = error.response?.status ?? 0;
  e.code = body?.code || (error.response ? 'INTERNAL' : 'NETWORK');
  e.params = body?.params || {};
  e.fields = body?.fields || {};
  return e;
}

export const api = {
  get: (url, params) => http.get(url, { params }).then((r) => r.data),
  post: (url, body, config) => http.post(url, body, config).then((r) => r.data),
  put: (url, body, config) => http.put(url, body, config).then((r) => r.data),
  patch: (url, body) => http.patch(url, body).then((r) => r.data),
  delete: (url) => http.delete(url).then((r) => r.data),
  // Authenticated file download (Excel exports).
  async download(url, params, filename) {
    const res = await http.get(url, { params, responseType: 'blob' });
    const href = URL.createObjectURL(res.data);
    const a = Object.assign(document.createElement('a'), { href, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  },
};
