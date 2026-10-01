import { useState } from 'react';
import { Box, Button, Card, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Download as DownloadIcon, Print as PrintIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { api } from '../../api/client';
import { EmptyState, PageHeader, Query } from '../../shared/components/ui';
import SectionSelect, { useSections } from '../../shared/components/SectionSelect';
import { monthISO } from '../../shared/utils/format';
import { useAction } from '../../shared/hooks/useNotify';

// Monthly register (students × days). Printing uses the browser, so every script prints correctly.
export default function RegisterPage() {
  const { t } = useTranslation();
  const { sections } = useSections();
  const [sectionId, setSectionId] = useState(null);
  const [month, setMonth] = useState(monthISO());
  const section = sectionId ?? sections[0]?.id;
  const q = useGet(section ? '/attendance/register' : null, { sectionId: section, month });
  const run = useAction();
  return (
    <>
      <PageHeader
        title={t('attendance.registerTitle')}
        back="/attendance"
        actions={
          <>
            <Button startIcon={<PrintIcon />} onClick={() => window.print()} variant="outlined" className="no-print">
              {t('common.print')}
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              className="no-print"
              onClick={() => run(() => api.download('/attendance/register', { sectionId: section, month, format: 'xlsx' }, `attendance-${month}.xlsx`))}
            >
              {t('common.downloadExcel')}
            </Button>
          </>
        }
      />
      <Stack direction="row" gap={2} sx={{ mb: 2 }} flexWrap="wrap" className="no-print">
        <SectionSelect value={section} onChange={setSectionId} sx={{ maxWidth: 260 }} />
        <TextField
          type="month"
          label={t('attendance.month')}
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
          sx={{ maxWidth: 200 }}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>
      {!section ? (
        <EmptyState title={t('classes.noSections')} />
      ) : (
        <Query q={q}>
          {({ data }) => (
            <Card sx={{ overflowX: 'auto' }}>
              <Typography variant="h3" sx={{ p: 2 }} className="print-only">
                {data.section.name} · {data.month}
              </Typography>
              <Table
                size="small"
                sx={{
                  '& td, & th': { px: 0.5, py: 0.5, textAlign: 'center', whiteSpace: 'nowrap' },
                  '& td:nth-of-type(2), & th:nth-of-type(2)': { textAlign: 'left' },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>{t('common.name')}</TableCell>
                    {data.days.map((d) => (
                      <TableCell key={d.date} sx={{ color: d.off ? 'text.disabled' : undefined }}>
                        {Number(d.date.slice(8))}
                      </TableCell>
                    ))}
                    <TableCell>{t('attendance.short.P')}</TableCell>
                    <TableCell>{t('attendance.short.A')}</TableCell>
                    <TableCell>%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.students.map((s) => (
                    <TableRow key={s.studentId}>
                      <TableCell>{s.rollNumber ?? ''}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      {data.days.map((d) => (
                        <TableCell
                          key={d.date}
                          sx={{
                            bgcolor: d.off ? 'action.hover' : undefined,
                            color: s.statuses[d.date] === 'A' ? 'error.main' : undefined,
                            fontWeight: s.statuses[d.date] === 'A' ? 700 : 400,
                          }}
                        >
                          {d.off ? '' : s.statuses[d.date] ? t(`attendance.short.${s.statuses[d.date]}`) : ''}
                        </TableCell>
                      ))}
                      <TableCell>{s.totals.present}</TableCell>
                      <TableCell>{s.totals.absent}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: s.totals.percent !== null && s.totals.percent < 75 ? 'error.main' : undefined }}>
                        {s.totals.percent ?? '–'}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell />
                    <TableCell sx={{ fontWeight: 700 }}>{t('attendance.presentPerDay')}</TableCell>
                    {data.days.map((d) => (
                      <TableCell key={d.date}>{d.off ? '' : data.dayTotals[d.date] || ''}</TableCell>
                    ))}
                    <TableCell colSpan={3} />
                  </TableRow>
                </TableBody>
              </Table>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('attendance.registerLegend')}
                </Typography>
              </Box>
            </Card>
          )}
        </Query>
      )}
    </>
  );
}
