import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { EditNote as EditNoteIcon, FactCheck as FactCheckIcon, People as PeopleIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { useAuth } from '../../app/AuthContext';
import { EmptyState, HelpTip, ProgressBar, Query } from '../../shared/components/ui';
import { fmtDate, fmtTime } from '../../shared/utils/format';
import ClassNoteDialog from '../diary/ClassNoteDialog';

export function SectionCard({ s, onNote }) {
  const { t } = useTranslation();
  const done = Boolean(s.submittedAt);
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Typography variant="h3">{s.name}</Typography>
          {s.isClassTeacher && <Chip size="small" label={t('today.classTeacher')} />}
        </Stack>
        <Typography sx={{ mt: 1 }} color={done ? 'success.main' : 'warning.main'} fontWeight={600}>
          {done ? t('today.attendanceDone', { present: s.present, total: s.strength, time: fmtTime(s.submittedAt) }) : t('today.attendanceNotTaken')}
        </Typography>
      </CardContent>
      <CardActions sx={{ flexWrap: 'wrap', gap: 1, p: 2, pt: 0 }}>
        <Button
          variant={done ? 'outlined' : 'contained'}
          size="large"
          startIcon={<FactCheckIcon />}
          component={RouterLink}
          to={`/attendance/${s.id}`}
          sx={{ flex: '1 1 100%' }}
        >
          {done ? t('today.editAttendance') : t('today.takeAttendance')}
        </Button>
        <Button startIcon={<PeopleIcon />} component={RouterLink} to={`/students?sectionId=${s.id}`}>
          {t('today.students')}
        </Button>
        {onNote && (
          <Button startIcon={<EditNoteIcon />} onClick={() => onNote(s)}>
            {t('today.classNote')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default function TodayPage() {
  const { t } = useTranslation();
  const { me } = useAuth();
  const q = useGet('/today');
  const [note, setNote] = useState(null);
  return (
    <Query q={q}>
      {({ data }) => (
        <Stack gap={3}>
          <Stack direction="row" alignItems="center">
            <Box sx={{ flex: 1 }}>
              <Typography variant="h1">{t('today.greeting', { name: me.name.split(' ')[0] })}</Typography>
              <Typography color="text.secondary">{fmtDate(data.date)}</Typography>
            </Box>
            <HelpTip text={t('help.today')} />
          </Stack>
          {data.holiday && (
            <Alert severity="info">{data.holiday.type === 'weekly_off' ? t('today.weeklyOff') : t('today.holiday', { name: data.holiday.name })}</Alert>
          )}
          {!data.year ? (
            <EmptyState title={t('today.noYear')} />
          ) : (
            <>
              <Box>
                <Typography variant="h2" gutterBottom>
                  {t('today.myClasses')}
                </Typography>
                {data.sections.length ? (
                  <Grid container spacing={2}>
                    {data.sections.map((s) => (
                      <Grid item xs={12} sm={6} md={4} key={s.id}>
                        <SectionCard s={s} onNote={setNote} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <EmptyState title={t('today.noClasses')} text={t('today.noClassesText')} />
                )}
              </Box>
              {data.subjects.length > 0 && (
                <Box>
                  <Typography variant="h2" gutterBottom>
                    {t('today.mySubjects')}
                  </Typography>
                  <Grid container spacing={2}>
                    {data.subjects.map((s) => (
                      <Grid item xs={12} sm={6} md={4} key={s.id}>
                        <Card component={RouterLink} to={`/syllabus/subjects/${s.id}`} sx={{ display: 'block', textDecoration: 'none', p: 2 }}>
                          <Typography fontWeight={700}>
                            {s.name} · {s.sectionName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {t('syllabus.progressText', { done: s.done, total: s.total, percent: s.percent })}
                          </Typography>
                          <ProgressBar percent={s.percent} />
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
      )}
    </Query>
  );
}
