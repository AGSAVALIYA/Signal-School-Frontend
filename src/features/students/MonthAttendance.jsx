import { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { Query } from '../../shared/components/ui';
import { monthISO } from '../../shared/utils/format';

const TONE = { P: 'success', A: 'error', L: 'warning', LATE: 'info' };

// One child's month as a calendar: easy to show a guardian which days the child came.
export default function MonthAttendance({ studentId }) {
  const { t } = useTranslation();
  const [month, setMonth] = useState(monthISO());
  const q = useGet(`/students/${studentId}/attendance`, { month });
  const weekdays = Array.from({ length: 7 }, (_, i) => dayjs().day(i).format('dd'));
  return (
    <Card>
      <CardContent sx={{ display: 'grid', gap: 2 }}>
        <Stack direction="row" sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="h3" sx={{ flex: 1 }}>
            {t('students.monthTitle')}
          </Typography>
          <TextField
            type="month"
            size="small"
            label={t('attendance.month')}
            value={month}
            onChange={(e) => e.target.value && setMonth(e.target.value)}
            sx={{ maxWidth: 180 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
        <Query q={q}>
          {({ data }) => {
            const blanks = dayjs(data.days[0].date).day();
            return (
              <>
                <Box role="list" aria-label={t('students.monthTitle')} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, maxWidth: 420 }}>
                  {weekdays.map((w) => (
                    <Typography key={w} variant="caption" aria-hidden sx={{ textAlign: 'center', color: 'text.secondary' }}>
                      {w}
                    </Typography>
                  ))}
                  {Array.from({ length: blanks }, (_, i) => (
                    <Box key={`b${i}`} aria-hidden />
                  ))}
                  {data.days.map((d) => (
                    <Box
                      key={d.date}
                      role="listitem"
                      title={d.holiday || (d.status ? t(`attendance.status.${d.status}`) : '')}
                      aria-label={`${dayjs(d.date).format('D MMM')}: ${d.off ? t('students.dayOff') : d.status ? t(`attendance.status.${d.status}`) : t('attendance.notMarked')}`}
                      sx={{
                        aspectRatio: '1',
                        borderRadius: 1,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '0.85rem',
                        fontWeight: d.status ? 700 : 400,
                        bgcolor: d.off ? 'action.hover' : d.status ? `${TONE[d.status]}.main` : 'transparent',
                        color: d.off ? 'text.secondary' : d.status ? `${TONE[d.status]}.contrastText` : 'text.primary',
                        border: !d.off && !d.status ? 1 : 0,
                        borderColor: 'divider',
                      }}
                    >
                      <span>{Number(d.date.slice(8))}</span>
                      {d.status && (
                        <Box component="span" sx={{ fontSize: '0.65rem', lineHeight: 1 }}>
                          {t(`attendance.short.${d.status}`)}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
                <Typography>
                  {data.totals.percent === null
                    ? t('students.noAttendance')
                    : t('students.monthTotals', {
                        present: data.totals.present,
                        absent: data.totals.absent,
                        leave: data.totals.leave,
                        percent: data.totals.percent,
                      })}
                </Typography>
              </>
            );
          }}
        </Query>
      </CardContent>
    </Card>
  );
}
