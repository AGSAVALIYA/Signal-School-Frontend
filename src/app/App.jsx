import { Suspense, lazy } from 'react';
import { Button } from '@mui/material';
import { Route, Routes, Navigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { YearProvider } from './YearContext';
import AppLayout from './AppLayout';
import { routes } from './routes';
import LoginPage from '../features/auth/LoginPage';
// The first-login form brings the form libraries (react-hook-form, zod): load them only for new users.
const FirstLoginPage = lazy(() => import('../features/auth/FirstLoginPage'));
import { EmptyState, Loading } from '../shared/components/ui';
import UpdatePrompt from './UpdatePrompt';
import ErrorBoundary from './ErrorBoundary';

export default function App() {
  const { t } = useTranslation();
  const { me, role, loading, logout } = useAuth();
  const { pathname } = useLocation();
  if (loading) return <Loading />;
  if (!me) return <LoginPage />;
  if (me.mustChangePassword)
    return (
      <Suspense fallback={<Loading />}>
        <FirstLoginPage />
      </Suspense>
    );
  if (!me.schools.length)
    return (
      <EmptyState
        title={t('errors.NO_SCHOOL')}
        action={
          <Button variant="contained" onClick={logout}>
            {t('auth.logout')}
          </Button>
        }
      />
    );
  return (
    <YearProvider>
      <UpdatePrompt />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<AppLayout />}>
            {routes(role).map((r) => (
              <Route
                key={r.path}
                path={r.path}
                element={
                  <ErrorBoundary resetKey={pathname}>
                    <Suspense fallback={<Loading />}>{r.element}</Suspense>
                  </ErrorBoundary>
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </YearProvider>
  );
}
