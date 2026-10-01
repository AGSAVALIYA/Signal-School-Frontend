import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Card, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { TableView as TableViewIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { useAuth } from '../../app/AuthContext';
import { isStaff } from '../../shared/utils/permissions';
import { EmptyState, PageHeader, Query, Stat } from '../../shared/components/ui';
import { fmtDate } from '../../shared/utils/format';
import { SectionCard } from '../today/TodayPage';

// Staff see the whole school's status today; teachers see their own classes.
export default function AttendancePage() {
  const { t } = useTranslation();
  const { role } = useAuth();
  const staff = isStaff(role) || role === 'clerk';
  const q = useGet(staff ? '/attendance/today' : '/today');
  const header = (
    <PageHeader
      title={t('nav.attendance')}
      actions={
        <Button startIcon={<TableViewIcon />} component={RouterLink} to="/attendance/register" variant="outlined">
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
                  <Grid item xs={12} sm={6} md={4} key={s.id}>
                    <SectionCard s={s} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <EmptyState title={t('today.noClasses')} text={t('today.noClassesText')} />
            );
          const done = data.sections.filter((s) => s.submittedAt);
          const present = done.reduce((n, s) => n + (s.present || 0), 0);
          const marked = done.reduce((n, s) => n + (s.present || 0) + (s.absent || 0) + (s.leave || 0), 0);
          return (
            <Stack gap={3}>
              <Typography color="text.secondary">{fmtDate(data.date)}</Typography>
              {data.holiday && <Alert severity="info">{data.holiday.name || t('today.weeklyOff')}</Alert>}
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                <Stat label={t('dashboard.classesDone')} value={`${done.length}/${data.sections.length}`} />
                <Stat label={t('dashboard.attendanceRate')} value={marked ? `${Math.round((100 * present) / marked)}%` : '–'} tone="success" />
                <Stat label={t('dashboard.absentToday')} value={data.absentees.length} tone="error" />
              </Box>
              <Card sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('students.fields.class')}</TableCell>
                      <TableCell>{t('common.status')}</TableCell>
                      <TableCell align="right">{t('attendance.status.P')}</TableCell>
                      <TableCell align="right">{t('attendance.status.A')}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.sections.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell sx={{ color: s.submittedAt ? 'success.main' : 'warning.main', fontWeight: 600 }}>
                          {s.submittedAt ? t('common.done') : t('common.pending')}
                        </TableCell>
                        <TableCell align="right">{s.present ?? '–'}</TableCell>
                        <TableCell align="right">{s.absent ?? '–'}</TableCell>
                        <TableCell align="right">
                          <Button size="small" component={RouterLink} to={`/attendance/${s.id}`}>
                            {t('common.open')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              {data.absentees.length > 0 && (
                <Box>
                  <Typography variant="h2" gutterBottom>
                    {t('dashboard.absentees')}
                  </Typography>
                  <Card>
                    {data.absentees.map((a) => (
                      <Stack key={a.id} direction="row" gap={1} sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }} alignItems="center" flexWrap="wrap">
                        <Typography component={RouterLink} to={`/students/${a.id}`} sx={{ flex: 1, minWidth: 160 }}>
                          {a.name} · {a.sectionName}
                        </Typography>
                        {a.guardianPhone && (
                          <Typography sx={{ userSelect: 'all', fontVariantNumeric: 'tabular-nums' }}>
                            {a.guardianName ? `${a.guardianName}: ` : ''}
                            <a href={`tel:${a.guardianPhone}`}>{a.guardianPhone}</a>
                          </Typography>
                        )}
                      </Stack>
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
