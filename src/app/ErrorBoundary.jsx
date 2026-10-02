import { Component } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { withTranslation } from 'react-i18next';

const RELOAD_KEY = 'ss.chunkReload';
const storage = {
  get: () => {
    try {
      return sessionStorage.getItem(RELOAD_KEY);
    } catch {
      return '1'; // storage blocked: never auto-reload, so we can never loop
    }
  },
  set: () => {
    try {
      sessionStorage.setItem(RELOAD_KEY, '1');
    } catch {
      /* ignore */
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(RELOAD_KEY);
    } catch {
      /* ignore */
    }
  },
};

// A new deploy removes old code files; a tab still running the old version reloads once instead of breaking.
const isChunkError = (error) => /Failed to fetch dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(String(error?.message));

// Last line of defence: a crash in one screen shows a friendly message instead of a blank page.
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidMount() {
    // Only forget the "already reloaded" mark once the app has run fine for a while; clearing it on first render
    // would let a screen that keeps failing to load reload forever.
    this.timer = setTimeout(() => !this.state.error && storage.clear(), 15000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentDidCatch(error) {
    if (isChunkError(error) && !storage.get()) {
      storage.set();
      window.location.reload();
    }
  }

  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    const { t } = this.props;
    if (!this.state.error) return this.props.children;
    return (
      <Box role="alert" sx={{ textAlign: 'center', py: 6, px: 2, display: 'grid', gap: 2, justifyItems: 'center' }}>
        <Typography variant="h2">{t('errors.crashTitle')}</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
          {t('errors.crashText')}
        </Typography>
        <Button variant="contained" size="large" onClick={() => window.location.reload()}>
          {t('common.reload')}
        </Button>
      </Box>
    );
  }
}

export default withTranslation()(ErrorBoundary);
