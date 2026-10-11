import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Card, CardActionArea, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { api } from '../../api/client';
import { useSend } from '../../api/hooks';
import { useAuth } from '../../app/AuthContext';
import { useAction } from '../../shared/hooks/useNotify';
import { LOOKS, LOOK_IDS, lookOf } from '../../theme/looks';
import { loadIcons, useLook } from '../../theme/LookContext';

const SAMPLE_ICONS = ['attendance', 'students', 'syllabus', 'marks'];

// A miniature of the app drawn in the look's own colours, fonts and icons.
function Preview({ id }) {
  const { t } = useTranslation();
  const look = LOOKS[id];
  const p = look.palette;
  const [icons, setIcons] = useState(null);
  useEffect(() => {
    let live = true;
    loadIcons(id).then((x) => live && setIcons(x));
    return () => {
      live = false;
    };
  }, [id]);
  const border = { soft: 'none', outlined: `1px solid ${p.divider}`, ruled: `1px solid ${p.divider}`, bold: '2px solid #000' }[look.surface];
  return (
    <Box aria-hidden sx={{ background: look.background, fontFamily: look.font, color: p.text.primary, borderRadius: 1, overflow: 'hidden' }}>
      <Box sx={{ background: look.bar.bg, color: look.bar.fg, px: 1.5, py: 1, fontFamily: look.headingFont, fontWeight: 700, fontSize: 14 }}>
        {t('common.appName')}
      </Box>
      {look.bar.stripe && <Box sx={{ height: 4, background: look.bar.stripe }} />}
      <Box sx={{ p: 1.5 }}>
        <Box
          sx={{
            bgcolor: p.background.paper,
            border,
            borderLeft: look.surface === 'ruled' ? `4px solid ${p.secondary.main}88` : undefined,
            boxShadow: look.surface === 'soft' ? '0 4px 14px rgba(0,0,0,.08)' : 'none',
            borderRadius: `${Math.min(look.radius, 16)}px`,
            p: 1.25,
          }}
        >
          <Box sx={{ fontFamily: look.headingFont, fontWeight: 700, fontSize: 16, mb: 0.75 }}>{t('look.sample')}</Box>
          <Stack direction="row" sx={{ gap: 0.75, mb: 1, color: p.primary.main }}>
            {icons &&
              SAMPLE_ICONS.map((k) => {
                const Icon = icons[k];
                return <Icon key={k} fontSize="small" />;
              })}
          </Stack>
          <Box
            sx={{
              display: 'inline-block',
              bgcolor: p.primary.main,
              color: p.primary.contrastText,
              borderRadius: `${Math.min(look.buttonRadius, 999)}px`,
              px: 1.5,
              py: 0.5,
              fontSize: 13,
              fontWeight: 700,
              border: look.surface === 'bold' ? '2px solid #000' : 'none',
            }}
          >
            {t('today.takeAttendance')}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// School settings → Look: everyone in the school sees the chosen look. "Try it" changes this screen only, until saved.
export default function LookPicker({ school }) {
  const { t } = useTranslation();
  const run = useAction();
  const { refreshMe } = useAuth();
  const { look, setLook } = useLook();
  const saved = lookOf(school.theme);
  const save = useSend((theme) => api.patch('/school', { theme }), { invalidate: ['/school'] });
  const trying = look !== saved;
  // Leaving the page while trying a look goes back to the school's look.
  const savedRef = useRef(saved);
  useEffect(() => {
    savedRef.current = saved;
  }, [saved]);
  useEffect(() => () => void setLook(savedRef.current), [setLook]);

  const use = async () => {
    const id = look;
    const ok = await run(() => save.mutateAsync(id), t('look.saved', { name: t(`look.names.${id}`) }));
    if (ok) {
      await setLook(id);
      await refreshMe();
    }
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography sx={{ color: 'text.secondary' }}>{t('look.help')}</Typography>
      {trying && (
        <Paper
          elevation={6}
          sx={{
            position: 'sticky',
            top: { xs: 68, sm: 80 },
            zIndex: 6,
            p: 1.5,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            flexWrap: 'wrap',
            borderRadius: 2,
          }}
          role="status"
        >
          <Typography sx={{ flex: '1 1 200px', fontWeight: 600 }}>{t('look.trying', { name: t(`look.names.${look}`) })}</Typography>
          <Button onClick={() => setLook(saved)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={use} disabled={save.isPending}>
            {t('look.use')}
          </Button>
        </Paper>
      )}
      <Grid container spacing={2}>
        {LOOK_IDS.map((id) => {
          const isSaved = id === saved;
          const isShown = id === look;
          return (
            <Grid key={id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: '100%', outline: isShown ? '3px solid' : 'none', outlineColor: 'primary.main', outlineOffset: 2 }}>
                <CardActionArea
                  onClick={() => setLook(id, { persist: false })}
                  aria-pressed={isShown}
                  sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1.25 }}
                >
                  <Preview id={id} />
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                    <Typography variant="h3" component="h3" sx={{ flex: 1 }}>
                      {t(`look.names.${id}`)}
                    </Typography>
                    {isSaved && <Chip size="small" color="success" label={t('look.current')} />}
                  </Stack>
                  <Stack direction="row" sx={{ gap: 0.5 }}>
                    {LOOKS[id].swatch.map((c) => (
                      <Box key={c} sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: c, border: '1px solid rgba(0,0,0,.2)' }} />
                    ))}
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t(`look.about.${id}`)}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {!trying && <Alert severity="info">{t('look.tip')}</Alert>}
    </Stack>
  );
}
