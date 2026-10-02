import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { todayISO } from '../../shared/utils/format';

const REASONS = ['migrated', 'dropped_out', 'transferred', 'tc_issued', 'other'];

export default function LeaveDialog({ name, onSubmit, onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ date: todayISO(), reason: 'migrated', note: '' });
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    if (await onSubmit(form)) onClose();
    setBusy(false);
  };
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{t('students.leaveTitle', { name })}</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <Typography sx={{ color: 'text.secondary' }}>{t('students.leaveText')}</Typography>
          <TextField
            type="date"
            label={t('common.date')}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField select label={t('students.leaveReason')} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}>
            {REASONS.map((r) => (
              <MenuItem key={r} value={r}>
                {t(`students.reasons.${r}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField label={t('common.notes')} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} multiline minRows={2} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="contained" color="warning" onClick={submit} disabled={busy}>
          {t('students.markLeft')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
