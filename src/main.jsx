import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
// Only the scripts we write in (no Cyrillic/Greek/Vietnamese, no duplicate Latin from the Indic packages).
// The browser downloads a subset only when the page shows characters from it.
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-700.css';
import '@fontsource/noto-sans/latin-ext-400.css';
import '@fontsource/noto-sans/latin-ext-700.css';
import '@fontsource/noto-sans-devanagari/devanagari-400.css';
import '@fontsource/noto-sans-devanagari/devanagari-700.css';
import '@fontsource/noto-sans-gujarati/gujarati-400.css';
import '@fontsource/noto-sans-gujarati/gujarati-700.css';
import { i18nReady } from './i18n';
import './styles.css';
import { makeTheme } from './app/theme';
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
// Render once the starting language is loaded (instant from the offline cache; falls back to English on error).
i18nReady.finally(() =>
  root.render(
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
  ),
);
