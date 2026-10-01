import { useState } from 'react';
import dayjs from 'dayjs';
import { Button, Card, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useYear } from '../../app/YearContext';
import { EmptyState, PageHeader, Query } from '../../shared/components/ui';
import { useAction } from '../../shared/hooks/useNotify';
import { useConfirm } from '../../shared/hooks/useConfirm';
import { fmtDate } from '../../shared/utils/format';

export default function HolidaysPage() {
  const { t } = useTranslation();
  const { selected } = useYear();
  const from = selected?.startDate || dayjs().startOf('year').format('YYYY-MM-DD');
  const to = selected?.endDate || dayjs().endOf('year').format('YYYY-MM-DD');
  const q = useGet('/holidays', { from, to });
  const [form, setForm] = useState({ date: '', name: '', type: 'holiday' });
  const run = useAction();
  const confirm = useConfirm();
  const add = useSend((body) => api.post('/holidays', body), { invalidate: ['/holidays'] });
  const remove = useSend((id) => api.delete(`/holidays/${id}`), { invalidate: ['/holidays'] });

  const submit = async (e) => {
    e.preventDefault();
    if (await run(() => add.mutateAsync(form), t('common.saved'))) setForm({ date: '', name: '', type: 'holiday' });
  };

  return (
    <>
      <PageHeader title={t('nav.holidays')} subtitle={t('holidays.subtitle')} />
      <Card sx={{ p: 2, mb: 3 }}>
        <Stack component="form" onSubmit={submit} direction={{ xs: 'column', sm: 'row' }} gap={2}>
          <TextField
            type="date"
            label={t('common.date')}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField label={t('holidays.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <TextField select label={t('holidays.type')} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {['holiday', 'exam', 'event'].map((v) => (
              <MenuItem key={v} value={v}>
                {t(`holidays.types.${v}`)}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
            {t('common.add')}
          </Button>
        </Stack>
      </Card>
      <Query q={q}>
        {({ data }) =>
          data.length ? (
            <Card>
              {data.map((h) => (
                <Stack key={h.id} direction="row" alignItems="center" gap={2} sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography sx={{ width: 130, fontVariantNumeric: 'tabular-nums' }}>{fmtDate(h.date)}</Typography>
                  <Typography sx={{ flex: 1 }}>{h.name}</Typography>
                  <Typography color="text.secondary">{t(`holidays.types.${h.type}`)}</Typography>
                  <IconButton
                    aria-label={t('common.delete')}
                    onClick={async () =>
                      (await confirm({ title: t('holidays.deleteConfirm', { name: h.name }), danger: true, confirmLabel: t('common.delete') })) &&
                      run(() => remove.mutateAsync(h.id))
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Card>
          ) : (
            <EmptyState title={t('holidays.none')} />
          )
        }
      </Query>
    </>
  );
}
