import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardActionArea, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { useAuth } from '../../app/AuthContext';
import { EmptyState, HelpTip, PageHeader, ProgressBar, Query } from '../../shared/components/ui';
import { fmtDate } from '../../shared/utils/format';

// Teachers see their own subjects first; everyone can open any subject of the school.
export default function SyllabusPage() {
  const { t } = useTranslation();
  const { role } = useAuth();
  const progress = useGet('/syllabus/progress');
  const mine = useGet(role === 'teacher' ? '/today' : null);
  const mineIds = new Set((mine.data?.data.subjects || []).map((s) => s.id));
  return (
    <>
      <PageHeader title={t('nav.syllabus')} actions={<HelpTip text={t('help.syllabus')} />} />
      <Query q={progress}>
        {({ data }) => {
          if (!data.length) return <EmptyState title={t('syllabus.noSubjects')} />;
          const groups = [];
          const sorted = role === 'teacher' ? [...data].sort((a, b) => Number(mineIds.has(b.subjectId)) - Number(mineIds.has(a.subjectId))) : data;
          sorted.forEach((r) => {
            const key = role === 'teacher' && mineIds.has(r.subjectId) ? 'mine' : r.sectionName;
            let g = groups.find((x) => x.key === key);
            if (!g) groups.push((g = { key, items: [] }));
            g.items.push(r);
          });
          return (
            <Stack gap={3}>
              {groups.map((g) => (
                <Box key={g.key}>
                  <Typography variant="h2" gutterBottom>
                    {g.key === 'mine' ? t('syllabus.mySubjects') : g.key}
                  </Typography>
                  <Grid container spacing={2}>
                    {g.items.map((r) => (
                      <Grid item xs={12} sm={6} md={4} key={r.subjectId}>
                        <Card>
                          <CardActionArea component={RouterLink} to={`/syllabus/subjects/${r.subjectId}`} sx={{ p: 0 }}>
                            <CardContent>
                              <Typography fontWeight={700}>
                                {r.subjectName}
                                {g.key === 'mine' ? ` · ${r.sectionName}` : ''}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {t('syllabus.progressText', { done: r.done, total: r.total, percent: r.percent })}
                              </Typography>
                              <ProgressBar percent={r.percent} />
                              {r.lastCompletedOn && (
                                <Typography variant="caption" color="text.secondary">
                                  {t('syllabus.lastUpdated', { date: fmtDate(r.lastCompletedOn) })}
                                </Typography>
                              )}
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Stack>
          );
        }}
      </Query>
    </>
  );
}
