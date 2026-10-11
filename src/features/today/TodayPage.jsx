import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Card, CardActionArea, Chip, Grid, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { useAuth } from '../../app/AuthContext';
import { EmptyState, HelpTip, IconTile, ProgressBar, Query, SectionTitle } from '../../shared/components/ui';
import { fmtDate, fmtTime } from '../../shared/utils/format';
import { useIcons } from '../../theme/LookContext';
import ClassNoteDialog from '../diary/ClassNoteDialog';

export function SectionCard({ s, onNote }) {
  const { t } = useTranslation();
  const I = useIcons();
  const done = Boolean(s.submittedAt);
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2, gap: 1.5 }}>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
        <IconTile name={done ? 'done' : 'attendance'} tone={done ? 'success' : 'warning'} size={44} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h3" component="h3">
            {s.name}
          </Typography>
          <Typography variant="body2" sx={{ color: done ? 'success.main' : 'warning.main', fontWeight: 600 }}>
            {done ? t('today.attendanceDone', { present: s.present, total: s.strength, time: fmtTime(s.submittedAt) }) : t('today.attendanceNotTaken')}
          </Typography>
        </Box>
        {s.isClassTeacher && <Chip size="small" icon={<I.star />} label={t('today.classTeacher')} sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />}
      </Stack>
      <Button
        variant={done ? 'outlined' : 'contained'}
        size="large"
        startIcon={done ? <I.edit /> : <I.attendance />}
        component={RouterLink}
        to={`/attendance/${s.id}`}
        fullWidth
      >
        {done ? t('today.editAttendance') : t('today.takeAttendance')}
      </Button>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
        <Button startIcon={<I.students />} component={RouterLink} to={`/students?sectionId=${s.id}`} sx={{ flex: 1 }}>
          {t('today.students')}
        </Button>
        {onNote && (
          <Button startIcon={<I.note />} onClick={() => onNote(s)} sx={{ flex: 1 }}>
            {t('today.classNote')}
          </Button>
        )}
      </Stack>
    </Card>
  );
}

// The teacher's home: what to do today, then the syllabus they teach.
export default function TodayPage() {
  const { t } = useTranslation();
  const { me } = useAuth();
  const q = useGet('/today');
  const [note, setNote] = useState(null);
  return (
    <Query q={q}>
      {({ data }) => {
        const pending = data.sections.filter((s) => !s.submittedAt).length;
        return (
          <Stack sx={{ gap: 3 }}>
            <Card
              sx={(th) => ({
                p: { xs: 2, sm: 3 },
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                background:
                  th.look?.surface === 'bold'
                    ? undefined
                    : `linear-gradient(120deg, ${alpha(th.palette.primary.main, 0.1)}, ${alpha(th.palette.secondary.main, 0.08)})`,
              })}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h1">{t('today.greeting', { name: me.name.split(' ')[0] })}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{fmtDate(data.date)}</Typography>
                {data.year && data.sections.length > 0 && !data.holiday && (
                  <Typography sx={{ mt: 1, fontWeight: 600, color: pending ? 'warning.main' : 'success.main' }}>
                    {pending ? t('today.pendingSummary', { count: pending }) : t('today.allDoneSummary')}
                  </Typography>
                )}
              </Box>
              <IconTile name="today" size={64} sx={{ display: { xs: 'none', sm: 'grid' } }} />
              <HelpTip text={t('help.today')} />
            </Card>
            {data.holiday && (
              <Alert severity="info">{data.holiday.type === 'weekly_off' ? t('today.weeklyOff') : t('today.holiday', { name: data.holiday.name })}</Alert>
            )}
            {!data.year ? (
              <EmptyState icon="years" title={t('today.noYear')} />
            ) : (
              <>
                <Box>
                  <SectionTitle>{t('today.myClasses')}</SectionTitle>
                  {data.sections.length ? (
                    <Grid container spacing={2}>
                      {data.sections.map((s) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={s.id}>
                          <SectionCard s={s} onNote={setNote} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <EmptyState icon="classes" title={t('today.noClasses')} text={t('today.noClassesText')} />
                  )}
                </Box>
                {data.subjects.length > 0 && (
                  <Box>
                    <SectionTitle>{t('today.mySubjects')}</SectionTitle>
                    <Grid container spacing={2}>
                      {data.subjects.map((s) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={s.id}>
                          <Card sx={{ height: '100%' }}>
                            <CardActionArea component={RouterLink} to={`/syllabus/subjects/${s.id}`} sx={{ p: 2, height: '100%' }}>
                              <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', mb: 1.5 }}>
                                <IconTile name="syllabus" tone="secondary" size={40} />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography sx={{ fontWeight: 700 }}>{s.name}</Typography>
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {s.sectionName}
                                  </Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{s.percent}%</Typography>
                              </Stack>
                              <ProgressBar percent={s.percent} />
                              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                {t('syllabus.progressText', { done: s.done, total: s.total, percent: s.percent })}
                              </Typography>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </>
            )}
            {note && <ClassNoteDialog section={note} onClose={() => setNote(null)} />}
          </Stack>
        );
      }}
    </Query>
  );
}
