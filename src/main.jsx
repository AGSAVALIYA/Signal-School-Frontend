import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './theme/fonts';
import { i18nReady } from './i18n';
import './styles.css';
import { LookProvider, lookReady } from './theme/LookContext';
import { AuthProvider } from './app/AuthContext';
import { NotifyProvider } from './shared/hooks/useNotify';
import { ConfirmProvider } from './shared/hooks/useConfirm';
import App from './app/App';
import ErrorBoundary from './app/ErrorBoundary';
import { startQueue } from './features/attendance/offlineQueue';
import { applyTextSize } from './shared/hooks/useTextSize';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: (count, err) => err?.code === 'NETWORK' && count < 2, refetchOnWindowFocus: false },
  },
});

startQueue();
applyTextSize();

const root = ReactDOM.createRoot(document.getElementById('root'));
// Render once the starting language and look are loaded (instant from the offline cache; English and plain icons on error).
Promise.allSettled([i18nReady, lookReady]).then(() =>
  root.render(
    <React.StrictMode>
      <LookProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <NotifyProvider>
              <ConfirmProvider>
                <AuthProvider>
                  <ErrorBoundary>
                    <App />
                  </ErrorBoundary>
                </AuthProvider>
              </ConfirmProvider>
            </NotifyProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </LookProvider>
    </React.StrictMode>,
  ),
);
