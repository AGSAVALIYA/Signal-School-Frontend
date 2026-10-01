import { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { YearProvider } from './YearContext';
import AppLayout from './AppLayout';
import { routes } from './routes';
import LoginPage from '../features/auth/LoginPage';
import FirstLoginPage from '../features/auth/FirstLoginPage';
import { EmptyState, Loading } from '../shared/components/ui';
import UpdatePrompt from './UpdatePrompt';

export default function App() {
  const { t } = useTranslation();
  const { me, role, loading, logout } = useAuth();
  if (loading) return <Loading />;
  if (!me) return <LoginPage />;
  if (me.mustChangePassword) return <FirstLoginPage />;
  if (!me.schools.length) return <EmptyState title={t('errors.NO_SCHOOL')} action={<button onClick={logout}>{t('auth.logout')}</button>} />;
  return (
    <YearProvider>
      <UpdatePrompt />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<AppLayout />}>
            {routes(role).map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </YearProvider>
  );
}
