import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useGet } from '../../api/hooks';
import { IconTile, PageHeader, PersonRow, ProgressBar, Query, Stat, StatGrid, percentTone } from '../../shared/components/ui';
import { useIcons } from '../../theme/LookContext';
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
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {pct}
            </Typography>
            <Box sx={{ width: '70%', maxWidth: 36, height: `${pct}px`, bgcolor: `${percentTone(pct)}.main`, borderRadius: '6px 6px 2px 2px' }} />
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
  const I = useIcons();
  return (
    <>
      <PageHeader title={t('nav.dashboard')} icon="dashboard" subtitle={q.data?.data.today ? fmtDate(q.data.data.today.date) : undefined} />
      <Query q={q}>
        {({ data }) => {
          const setupLeft = SETUP.filter(([k]) => !data.setup[k]);
          const today = data.today;
          const done = today?.sections.filter((s) => s.submittedAt) || [];
          const daysLeft = data.year ? dayjs(data.year.endDate).diff(dayjs(), 'day') : null;
          return (
            <Stack sx={{ gap: 3 }}>
              <StatGrid>
                <Stat icon="students" label={t('dashboard.students')} value={data.counts.students} />
                <Stat icon="teacher" tone="secondary" label={t('dashboard.teachers')} value={data.counts.teachers} />
                <Stat icon="classes" tone="info" label={t('dashboard.sections')} value={data.counts.sections} />
                {today && (
                  <Stat
                    icon="attendance"
                    label={t('dashboard.classesDone')}
                    value={`${done.length}/${today.sections.length}`}
                    tone={done.length === today.sections.length ? 'success' : 'warning'}
                  />
                )}
                {today && <Stat icon="absent" label={t('dashboard.absentToday')} value={today.absentees.length} tone="error" />}
                {today && done.length > 0 && (
                  <Stat icon="meals" tone="secondary" label={t('dashboard.mealsToday')} value={done.reduce((n, s) => n + (s.present || 0), 0)} />
                )}
              </StatGrid>
              {setupLeft.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h2" gutterBottom>
                      {t('dashboard.setupTitle')}
                    </Typography>
                    {SETUP.map(([k, to]) => (
                      <Stack key={k} direction="row" sx={{ gap: 1, alignItems: 'center', py: 0.5 }}>
                        {data.setup[k] ? <I.done color="success" /> : <I.todo color="disabled" />}
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
                <Alert severity="warning" icon={<I.health />}>
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
                <Card sx={{ borderLeft: 6, borderLeftColor: 'error.main', borderLeftStyle: 'solid' }}>
                  <CardContent>
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                      <IconTile name="absent" tone="error" />
                      <Box>
                        <Typography variant="h3">{t('dashboard.streakTitle')}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('dashboard.streakHelp')}
                        </Typography>
                      </Box>
                    </Stack>
                    <Box sx={{ mt: 1 }}>
                      {data.consecutiveAbsences.map((s) => (
                        <PersonRow
                          key={s.id}
                          photo={s.thumbUrl}
                          name={s.name}
                          to={`/students/${s.id}`}
                          badge={<Chip size="small" color="error" label={t('dashboard.daysChip', { count: s.days })} />}
                          detail={`${s.sectionName} · ${t('dashboard.since', { date: fmtDate(s.since) })}`}
                          actions={
                            <ContactButtons
                              phone={s.guardianPhone}
                              language={s.guardianLanguage}
                              message="contact.streakMessage"
                              params={{ name: s.name, school: school?.name, days: s.days }}
                            />
                          }
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
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
                      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        {today?.sections
                          .filter((s) => !s.submittedAt)
                          .map((s) => (
                            <Chip
                              key={s.id}
                              clickable
                              color="warning"
                              variant="outlined"
                              icon={<I.attendance />}
                              label={s.name}
                              component={RouterLink}
                              to={`/attendance/${s.id}`}
                              sx={{ minHeight: 40 }}
                            />
                          ))}
                      </Stack>
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
                          <Stack direction="row" sx={{ mb: 0.5 }}>
                            <Typography sx={{ flex: 1, fontWeight: 600 }}>{s.sectionName}</Typography>
                            <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{s.percent}%</Typography>
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
                      <Box sx={{ mt: 1 }}>
                        {data.atRisk.map((s) => (
                          <PersonRow
                            key={s.id}
                            photo={s.thumbUrl}
                            name={s.name}
                            to={`/students/${s.id}`}
                            detail={s.sectionName}
                            badge={<Chip size="small" color={percentTone(s.percent)} label={`${s.percent}%`} />}
                            actions={
                              <ContactButtons
                                phone={s.guardianPhone}
                                language={s.guardianLanguage}
                                message="contact.lowAttendanceMessage"
                                params={{ name: s.name, school: school?.name, percent: s.percent }}
                              />
                            }
                          />
                        ))}
                        {!data.atRisk.length && <Typography sx={{ color: 'success.main' }}>{t('dashboard.noneAtRisk')}</Typography>}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                {data.birthdays.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Alert severity="success" icon={<I.birthday />}>
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
