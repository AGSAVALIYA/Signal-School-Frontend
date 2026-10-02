import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Card, CardContent, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { LocalHospital as LocalHospitalIcon, CheckCircle as CheckCircleIcon, RadioButtonUnchecked as RadioButtonUncheckedIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useGet } from '../../api/hooks';
import { PageHeader, ProgressBar, Query, Stat } from '../../shared/components/ui';
import { fmtDate } from '../../shared/utils/format';
import { useAuth } from '../../app/AuthContext';
import ContactButtons from '../../shared/components/ContactButtons';

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
  if (!rows.length) return <Typography sx={{ color: 'text.secondary' }}>{t('dashboard.noTrend')}</Typography>;
  return (
    <Stack direction="row" sx={{ gap: 0.5, alignItems: 'flex-end', height: 140, overflowX: 'auto' }} role="img" aria-label={t('dashboard.trend')} tabIndex={0}>
      {rows.map((r) => {
        const pct = r.marked ? Math.round((100 * r.present) / r.marked) : 0;
        return (
          <Stack key={r.date} sx={{ alignItems: 'center', minWidth: 34, flex: 1 }} title={`${fmtDate(r.date)}: ${pct}%`}>
            <Typography variant="caption">{pct}</Typography>
            <Box sx={{ width: '70%', height: `${pct}px`, bgcolor: pct < 75 ? 'warning.main' : 'primary.main', borderRadius: '4px 4px 0 0' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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
  const { school } = useAuth();
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
            <Stack sx={{ gap: 3 }}>
              {setupLeft.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h2" gutterBottom>
                      {t('dashboard.setupTitle')}
                    </Typography>
                    {SETUP.map(([k, to]) => (
                      <Stack key={k} direction="row" sx={{ gap: 1, alignItems: 'center', py: 0.5 }}>
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
              {data.counts.healthFollowUps > 0 && (
                <Alert severity="warning" icon={<LocalHospitalIcon />}>
                  {t('health.followUpsAlert', { count: data.counts.healthFollowUps })}
                </Alert>
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
              {data.consecutiveAbsences?.length > 0 && (
                <Card sx={{ borderColor: 'error.main' }}>
                  <CardContent>
                    <Typography variant="h3">{t('dashboard.streakTitle')}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t('dashboard.streakHelp')}
                    </Typography>
                    <List dense>
                      {data.consecutiveAbsences.map((s) => (
                        <ListItem key={s.id} disableGutters sx={{ flexWrap: 'wrap', gap: 1 }}>
                          <ListItemText
                            primary={
                              <RouterLink to={`/students/${s.id}`} style={{ color: 'inherit' }}>
                                {`${s.name} · ${s.sectionName}`}
                              </RouterLink>
                            }
                            secondary={t('dashboard.streakDays', { count: s.days, since: fmtDate(s.since) })}
                            sx={{ flex: '1 1 200px', my: 0 }}
                          />
                          <ContactButtons
                            phone={s.guardianPhone}
                            language={s.guardianLanguage}
                            message="contact.streakMessage"
                            params={{ name: s.name, school: school?.name, days: s.days }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
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
                {today && done.length > 0 && <Stat label={t('dashboard.mealsToday')} value={done.reduce((n, s) => n + (s.present || 0), 0)} />}
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h3" gutterBottom>
                        {t('dashboard.trend')}
                      </Typography>
                      <Trend rows={data.trend} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack direction="row" sx={{ alignItems: 'center' }}>
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
                          <Button key={s.id} component={RouterLink} to={`/attendance/${s.id}`} sx={{ justifyContent: 'flex-start', display: 'flex' }}>
                            {s.name}
                          </Button>
                        ))}
                      {today && done.length === today.sections.length && <Typography sx={{ color: 'success.main' }}>{t('dashboard.allDone')}</Typography>}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h3">{t('dashboard.atRisk')}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t('dashboard.atRiskHelp')}
                      </Typography>
                      <List dense>
                        {data.atRisk.map((s) => (
                          <ListItem key={s.id} disableGutters sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <ListItemText
                              primary={
                                <RouterLink to={`/students/${s.id}`} style={{ color: 'inherit' }}>
                                  {`${s.name} · ${s.sectionName}`}
                                </RouterLink>
                              }
                              secondary={`${s.percent}%`}
                              sx={{ flex: '1 1 200px', my: 0 }}
                            />
                            <ContactButtons
                              phone={s.guardianPhone}
                              language={s.guardianLanguage}
                              message="contact.lowAttendanceMessage"
                              params={{ name: s.name, school: school?.name, percent: s.percent }}
                            />
                          </ListItem>
                        ))}
                        {!data.atRisk.length && <Typography sx={{ color: 'success.main' }}>{t('dashboard.noneAtRisk')}</Typography>}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                {data.birthdays.length > 0 && (
                  <Grid size={{ xs: 12 }}>
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
