import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/700.css';
import '@fontsource/noto-sans-devanagari/400.css';
import '@fontsource/noto-sans-devanagari/700.css';
import '@fontsource/noto-sans-gujarati/400.css';
import '@fontsource/noto-sans-gujarati/700.css';
import './i18n';
import './styles.css';
import { makeTheme } from './app/theme';
import { AuthProvider } from './app/AuthContext';
import { NotifyProvider } from './shared/hooks/useNotify';
import { ConfirmProvider } from './shared/hooks/useConfirm';
import App from './app/App';
import ErrorBoundary from './app/ErrorBoundary';
import { startQueue } from './features/attendance/offlineQueue';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: (count, err) => err?.code === 'NETWORK' && count < 2, refetchOnWindowFocus: false },
  },
});

startQueue();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={makeTheme()}>
      <CssBaseline />
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
    </ThemeProvider>
  </React.StrictMode>,
);
