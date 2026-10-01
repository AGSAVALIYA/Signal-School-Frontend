import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { CheckCircle as CheckCircleIcon, RadioButtonUnchecked as RadioButtonUncheckedIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useGet } from '../../api/hooks';
import { PageHeader, ProgressBar, Query, Stat } from '../../shared/components/ui';
import { fmtDate } from '../../shared/utils/format';

const SETUP = [
  ['year', '/years'],
  ['grades', '/classes'],
  ['sections', '/classes'],
  ['subjects', '/classes'],
  ['teachers', '/staff'],
  ['students', '/students'],
];

function Trend({ rows }) {
  const { t } = useTranslation();
  if (!rows.length) return <Typography color="text.secondary">{t('dashboard.noTrend')}</Typography>;
  return (
    <Stack direction="row" gap={0.5} alignItems="flex-end" sx={{ height: 140, overflowX: 'auto' }} role="img" aria-label={t('dashboard.trend')}>
      {rows.map((r) => {
        const pct = r.marked ? Math.round((100 * r.present) / r.marked) : 0;
        return (
          <Stack key={r.date} alignItems="center" sx={{ minWidth: 34, flex: 1 }} title={`${fmtDate(r.date)}: ${pct}%`}>
            <Typography variant="caption">{pct}</Typography>
            <Box sx={{ width: '70%', height: `${pct}px`, bgcolor: pct < 75 ? 'warning.main' : 'primary.main', borderRadius: '4px 4px 0 0' }} />
            <Typography variant="caption" color="text.secondary">
              {dayjs(r.date).format('DD')}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const q = useGet('/dashboard');
  return (
    <>
      <PageHeader title={t('nav.dashboard')} />
      <Query q={q}>
        {({ data }) => {
          const setupLeft = SETUP.filter(([k]) => !data.setup[k]);
          const today = data.today;
          const done = today?.sections.filter((s) => s.submittedAt) || [];
          const daysLeft = data.year ? dayjs(data.year.endDate).diff(dayjs(), 'day') : null;
          return (
            <Stack gap={3}>
              {setupLeft.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h2" gutterBottom>
                      {t('dashboard.setupTitle')}
                    </Typography>
                    {SETUP.map(([k, to]) => (
                      <Stack key={k} direction="row" gap={1} alignItems="center" sx={{ py: 0.5 }}>
                        {data.setup[k] ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon color="disabled" />}
                        <Typography sx={{ flex: 1 }}>{t(`dashboard.setup.${k}`)}</Typography>
                        {!data.setup[k] && (
                          <Button size="small" component={RouterLink} to={to}>
                            {t('dashboard.doThis')}
                          </Button>
                        )}
                      </Stack>
                    ))}
                  </CardContent>
                </Card>
              )}
              {daysLeft !== null && daysLeft <= 45 && (
                <Alert
                  severity="info"
                  action={
                    <Button color="inherit" component={RouterLink} to="/years/new">
                      {t('years.startNew')}
                    </Button>
                  }
                >
                  {t('dashboard.yearEnds', { name: data.year.name, days: Math.max(daysLeft, 0) })}
                </Alert>
              )}
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                <Stat label={t('dashboard.students')} value={data.counts.students} />
                <Stat label={t('dashboard.teachers')} value={data.counts.teachers} />
                <Stat label={t('dashboard.sections')} value={data.counts.sections} />
                {today && (
                  <Stat
                    label={t('dashboard.classesDone')}
                    value={`${done.length}/${today.sections.length}`}
                    tone={done.length === today.sections.length ? 'success' : 'warning'}
                  />
                )}
                {today && <Stat label={t('dashboard.absentToday')} value={today.absentees.length} tone="error" />}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h3" gutterBottom>
                        {t('dashboard.trend')}
                      </Typography>
                      <Trend rows={data.trend} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center">
                        <Typography variant="h3" sx={{ flex: 1 }}>
                          {t('dashboard.pendingClasses')}
                        </Typography>
                        <Button size="small" component={RouterLink} to="/attendance">
                          {t('common.viewAll')}
                        </Button>
                      </Stack>
                      {today?.sections
                        .filter((s) => !s.submittedAt)
                        .map((s) => (
                          <Typography key={s.id} sx={{ py: 0.5 }}>
                            {s.name}
                          </Typography>
                        ))}
                      {today && done.length === today.sections.length && <Typography color="success.main">{t('dashboard.allDone')}</Typography>}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h3" gutterBottom>
                        {t('dashboard.syllabusProgress')}
                      </Typography>
                      {data.syllabus.map((s) => (
                        <Box key={s.sectionId} sx={{ mb: 1.5 }}>
                          <Stack direction="row">
                            <Typography sx={{ flex: 1 }}>{s.sectionName}</Typography>
                            <Typography sx={{ fontVariantNumeric: 'tabular-nums' }}>{s.percent}%</Typography>
                          </Stack>
                          <ProgressBar percent={s.percent} />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h3">{t('dashboard.atRisk')}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('dashboard.atRiskHelp')}
                      </Typography>
                      <List dense>
                        {data.atRisk.map((s) => (
                          <ListItem key={s.id} component={RouterLink} to={`/students/${s.id}`} sx={{ color: 'inherit' }}>
                            <ListItemText primary={`${s.name} · ${s.sectionName}`} secondary={[`${s.percent}%`, s.guardianPhone].filter(Boolean).join(' · ')} />
                          </ListItem>
                        ))}
                        {!data.atRisk.length && <Typography color="success.main">{t('dashboard.noneAtRisk')}</Typography>}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                {data.birthdays.length > 0 && (
                  <Grid item xs={12}>
                    <Alert severity="success">
                      {t('dashboard.birthdays', { names: data.birthdays.map((b) => `${b.name} (${b.sectionName})`).join(', ') })}
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Stack>
          );
        }}
      </Query>
    </>
  );
}
