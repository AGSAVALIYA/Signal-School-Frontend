import { useParams, useSearchParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { PageHeader, Query } from '../../shared/components/ui';
import { fmtDate } from '../../shared/utils/format';

// Printable report card; the browser renders and prints every Indian script correctly.
export default function ReportCardPage() {
  const { t } = useTranslation();
  const { studentId } = useParams();
  const [params] = useSearchParams();
  const term = params.get('term') || 'S1';
  const q = useGet(`/report-cards/${studentId}`, { term });
  return (
    <Query q={q}>
      {({ data }) => (
        <>
          <Box className="no-print">
            <PageHeader
              back
              title={t('marks.reportCard')}
              actions={
                <Button startIcon={<PrintIcon />} variant="contained" onClick={() => window.print()}>
                  {t('common.print')}
                </Button>
              }
            />
          </Box>
          <Card sx={{ maxWidth: 800, mx: 'auto' }} className="print-area">
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" gap={2} alignItems="center" sx={{ mb: 3 }}>
                {data.school.logoUrl && <Box component="img" src={data.school.logoUrl} alt="" sx={{ height: 64 }} />}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h1">{data.school.name}</Typography>
                  <Typography color="text.secondary">{data.school.address}</Typography>
                </Box>
              </Stack>
              <Typography variant="h2" textAlign="center" gutterBottom>
                {t('marks.reportCard')} · {t(`marks.terms.${data.term}`)} · {data.year.name}
              </Typography>
              <Grid container spacing={2} sx={{ my: 2 }}>
                {[
                  [t('students.fields.name'), data.student.name],
                  [t('students.fields.class'), data.section],
                  [t('students.fields.rollNumber'), data.rollNumber],
                  [t('students.fields.grNumber'), data.student.grNumber],
                  [t('students.fields.dob'), fmtDate(data.student.dob)],
                  [t('students.fields.guardianName'), data.student.guardianName],
                ].map(([k, v]) => (
                  <Grid item xs={6} key={k}>
                    <Typography variant="body2" color="text.secondary">
                      {k}
                    </Typography>
                    <Typography fontWeight={600}>{v || '–'}</Typography>
                  </Grid>
                ))}
              </Grid>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('marks.subject')}</TableCell>
                    <TableCell>{t('marks.grade')}</TableCell>
                    <TableCell>{t('marks.marks')}</TableCell>
                    <TableCell>{t('marks.remarks')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.subjects.map((s) => (
                    <TableRow key={s.subject}>
                      <TableCell>{s.subject}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{s.grade || '–'}</TableCell>
                      <TableCell>{s.marks !== null ? `${Number(s.marks)}${s.maxMarks ? ` / ${Number(s.maxMarks)}` : ''}` : '–'}</TableCell>
                      <TableCell>{s.remarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography sx={{ mt: 3 }}>{data.attendance.total ? t('marks.attendanceLine', data.attendance) : t('students.noAttendance')}</Typography>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 8 }}>
                <Typography>{t('marks.classTeacherSign')}</Typography>
                <Typography>{t('marks.principalSign')}</Typography>
                <Typography>{t('marks.parentSign')}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </>
      )}
    </Query>
  );
}
