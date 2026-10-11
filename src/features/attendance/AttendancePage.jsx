import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Card, CardActionArea, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { useAuth } from '../../app/AuthContext';
import { isStaff } from '../../shared/utils/permissions';
import { EmptyState, IconTile, PageHeader, PersonRow, Query, SectionTitle, Stat, StatGrid, percentTone } from '../../shared/components/ui';
import { useIcons } from '../../theme/LookContext';
import { fmtDate } from '../../shared/utils/format';
import { SectionCard } from '../today/TodayPage';
import ContactButtons from '../../shared/components/ContactButtons';

// Staff see the whole school's status today; teachers see their own classes.
export default function AttendancePage() {
  const { t } = useTranslation();
  const { role, school } = useAuth();
  const I = useIcons();
  const staff = isStaff(role) || role === 'clerk';
  const q = useGet(staff ? '/attendance/today' : '/today');
  const header = (
    <PageHeader
      title={t('nav.attendance')}
      icon="attendance"
      subtitle={q.data ? fmtDate(q.data.data.date) : undefined}
      actions={
        <Button startIcon={<I.register />} component={RouterLink} to="/attendance/register" variant="outlined">
          {t('attendance.registerTitle')}
        </Button>
      }
    />
  );
  return (
    <>
      {header}
      <Query q={q}>
        {({ data }) => {
          if (!staff)
            return data.sections.length ? (
              <Grid container spacing={2}>
                {data.sections.map((s) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.id}>
                    <SectionCard s={s} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <EmptyState icon="classes" title={t('today.noClasses')} text={t('today.noClassesText')} />
            );
          const done = data.sections.filter((s) => s.submittedAt);
          const present = done.reduce((n, s) => n + (s.present || 0), 0);
          const marked = done.reduce((n, s) => n + (s.present || 0) + (s.absent || 0) + (s.leave || 0), 0);
          const rate = marked ? Math.round((100 * present) / marked) : 0;
          return (
            <Stack sx={{ gap: 3 }}>
              {data.holiday && <Alert severity="info">{data.holiday.name || t('today.weeklyOff')}</Alert>}
              <StatGrid>
                <Stat
                  icon="attendance"
                  label={t('dashboard.classesDone')}
                  value={`${done.length}/${data.sections.length}`}
                  tone={done.length === data.sections.length ? 'success' : 'warning'}
                />
                <Stat icon="present" label={t('dashboard.attendanceRate')} value={marked ? `${rate}%` : '–'} tone={marked ? percentTone(rate) : undefined} />
                <Stat icon="absent" label={t('dashboard.absentToday')} value={data.absentees.length} tone="error" />
                <Stat icon="meals" tone="secondary" label={t('dashboard.mealsToday')} value={done.length ? present : '–'} />
              </StatGrid>
              <Box>
                <SectionTitle>{t('attendance.byClass')}</SectionTitle>
                <Grid container spacing={1.5}>
                  {data.sections.map((s) => {
                    const ok = Boolean(s.submittedAt);
                    return (
                      <Grid key={s.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                        <Card>
                          <CardActionArea
                            component={RouterLink}
                            to={`/attendance/${s.id}`}
                            sx={{ p: 1.5, display: 'flex', gap: 1.5, alignItems: 'center', justifyContent: 'flex-start' }}
                          >
                            <IconTile name={ok ? 'done' : 'attendance'} tone={ok ? 'success' : 'warning'} />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 700 }}>{s.name}</Typography>
                              <Typography variant="body2" sx={{ color: ok ? 'success.main' : 'warning.main', fontWeight: 600 }}>
                                {ok ? t('attendance.classSummary', { present: s.present ?? 0, absent: s.absent ?? 0 }) : t('common.pending')}
                              </Typography>
                            </Box>
                            <I.chevron sx={{ color: 'text.secondary' }} />
                          </CardActionArea>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
              {data.absentees.length > 0 && (
                <Box>
                  <SectionTitle>{t('dashboard.absentees')}</SectionTitle>
                  <Card sx={{ px: 2 }}>
                    {data.absentees.map((a) => (
                      <PersonRow
                        key={a.id}
                        photo={a.thumbUrl}
                        name={a.name}
                        to={`/students/${a.id}`}
                        detail={[a.sectionName, a.guardianPhone && `${a.guardianName ? `${a.guardianName}: ` : ''}${a.guardianPhone}`]
                          .filter(Boolean)
                          .join(' · ')}
                        actions={
                          <ContactButtons
                            phone={a.guardianPhone}
                            language={a.guardianLanguage}
                            message="contact.absentMessage"
                            params={{ name: a.name, school: school?.name, date: fmtDate(data.date) }}
                          />
                        }
                      />
                    ))}
                  </Card>
                </Box>
              )}
            </Stack>
          );
        }}
      </Query>
    </>
  );
}
