import { useParams } from 'react-router';
import { Box, Button, Card, CardContent, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { EmptyState, Loading, PageHeader } from '../../shared/components/ui';
import { fmtDate, todayISO } from '../../shared/utils/format';

// School leaving certificate, printed by the browser so every Indian script prints correctly.
// Families need it to admit the child to the next (mainstream) school.
export default function LeavingCertificatePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const student = useGet(`/students/${id}`);
  const history = useGet(`/students/${id}/history`);
  const school = useGet('/school');
  if (student.isLoading || history.isLoading || school.isLoading) return <Loading />;
  if (!student.data || !school.data) return <EmptyState title={t('errors.NOT_FOUND')} />;
  const s = student.data.data;
  const sc = school.data.data;
  const last = history.data?.data?.[0];
  const rows = [
    [t('students.fields.grNumber'), s.grNumber],
    [t('students.fields.name'), s.name],
    [t('students.fields.fatherName'), s.fatherName],
    [t('students.fields.motherName'), s.motherName],
    [t('students.fields.guardianName'), s.guardianName],
    [t('students.fields.dob'), s.dob ? fmtDate(s.dob) : s.estimatedBirthYear ? t('certificate.approxBirthYear', { year: s.estimatedBirthYear }) : null],
    [t('students.fields.admissionDate'), fmtDate(s.admissionDate)],
    [t('certificate.lastClass'), last ? `${last.sectionName} (${last.yearName})` : null],
    [
      t('certificate.attendance'),
      last && last.present + last.absent + last.leave
        ? t('certificate.attendanceValue', { present: last.present, total: last.present + last.absent + last.leave })
        : null,
    ],
    [t('certificate.leftOn'), s.leftOn ? fmtDate(s.leftOn) : null],
    [t('students.leaveReason'), s.leftReason ? t(`students.reasons.${s.leftReason}`) : null],
    [t('certificate.toSchool'), s.leftToSchool],
    [t('common.notes'), s.leftNote],
  ];
  return (
    <>
      <Box className="no-print">
        <PageHeader
          back
          title={t('certificate.title')}
          actions={
            <Button startIcon={<PrintIcon />} variant="contained" onClick={() => window.print()}>
              {t('common.print')}
            </Button>
          }
        />
        {s.status === 'active' && <Typography sx={{ mb: 2, color: 'warning.main' }}>{t('certificate.stillActive')}</Typography>}
      </Box>
      <Card className="print-portrait" sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Stack direction="row" sx={{ gap: 2, alignItems: 'center', mb: 2 }}>
            {sc.logoUrl && <Box component="img" src={sc.logoUrl} alt="" sx={{ height: 64 }} />}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h1">{sc.name}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{[sc.address, sc.udiseCode && `UDISE ${sc.udiseCode}`].filter(Boolean).join(' · ')}</Typography>
            </Box>
          </Stack>
          <Typography variant="h2" sx={{ textAlign: 'center', my: 2, textDecoration: 'underline' }}>
            {t('certificate.title')}
          </Typography>
          <Table size="small">
            <TableBody>
              {rows
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <TableRow key={k}>
                    <TableCell sx={{ width: '40%', color: 'text.secondary' }}>{k}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{v}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Typography sx={{ mt: 3 }}>{t('certificate.statement', { name: s.name, school: sc.name })}</Typography>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 8, gap: 2 }}>
            <Typography>{t('certificate.date', { date: fmtDate(todayISO()) })}</Typography>
            <Typography>{t('certificate.clerkSign')}</Typography>
            <Typography>{t('marks.principalSign')}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
