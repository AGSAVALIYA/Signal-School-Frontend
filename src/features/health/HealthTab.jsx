import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Checkbox, FormControlLabel, IconButton, Stack, TextField, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, LocalHospital as LocalHospitalIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { isStaff } from '../../shared/utils/permissions';
import { EmptyState, Query } from '../../shared/components/ui';
import { useAction } from '../../shared/hooks/useNotify';
import { useConfirm } from '../../shared/hooks/useConfirm';
import { fmtDate, todayISO } from '../../shared/utils/format';

const blank = () => ({ checkedOn: todayISO(), heightCm: '', weightKg: '', needsFollowUp: false, notes: '' });
const num = (v) => (v === '' || v === null ? null : Number(v));

function HealthForm({ onSave, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const empty = form.heightCm === '' && form.weightKg === '' && !form.notes.trim();
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await onSave({ ...form, heightCm: num(form.heightCm), weightKg: num(form.weightKg), notes: form.notes.trim() || null });
    setBusy(false);
    if (ok) setForm(blank());
  };
  return (
    <Card>
      <CardContent component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
        <Typography variant="h3">{t('health.add')}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            type="date"
            label={t('health.checkedOn')}
            value={form.checkedOn}
            onChange={set('checkedOn')}
            required
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: todayISO() } }}
          />
          <TextField
            type="number"
            label={t('health.heightCm')}
            value={form.heightCm}
            onChange={set('heightCm')}
            slotProps={{ htmlInput: { min: 30, max: 250, step: 0.1, inputMode: 'decimal' } }}
          />
          <TextField
            type="number"
            label={t('health.weightKg')}
            value={form.weightKg}
            onChange={set('weightKg')}
            slotProps={{ htmlInput: { min: 2, max: 200, step: 0.1, inputMode: 'decimal' } }}
          />
        </Stack>
        <TextField label={t('health.notes')} placeholder={t('health.notesHint')} value={form.notes} onChange={set('notes')} multiline minRows={2} />
        <FormControlLabel control={<Checkbox checked={form.needsFollowUp} onChange={set('needsFollowUp')} />} label={t('health.needsFollowUp')} />
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button type="submit" variant="contained" disabled={busy || empty}>
            {busy ? t('common.saving') : t('common.save')}
          </Button>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Check-ups from health camps: growth (height/weight) and anything the doctor should see again.
export default function HealthTab({ studentId, canWrite }) {
  const { t } = useTranslation();
  const { me, role } = useAuth();
  const run = useAction();
  const confirm = useConfirm();
  const [adding, setAdding] = useState(false);
  const q = useGet(`/students/${studentId}/health`);
  const inv = { invalidate: ['/students', '/health', '/dashboard'] };
  const add = useSend((body) => api.post(`/students/${studentId}/health`, body), inv);
  const remove = useSend((id) => api.delete(`/health/${id}`), inv);
  return (
    <Stack sx={{ gap: 2 }}>
      {canWrite &&
        (adding ? (
          <HealthForm
            onCancel={() => setAdding(false)}
            onSave={async (body) => {
              const ok = await run(() => add.mutateAsync(body), t('common.saved'));
              if (ok) setAdding(false);
              return ok;
            }}
          />
        ) : (
          <Button startIcon={<AddIcon />} variant="outlined" onClick={() => setAdding(true)} sx={{ alignSelf: 'flex-start' }}>
            {t('health.add')}
          </Button>
        ))}
      <Query q={q}>
        {({ data }) =>
          data.length ? (
            <>
              {data[0].needsFollowUp && (
                <Alert severity="warning" icon={<LocalHospitalIcon />}>
                  {t('health.followUpNeeded')}
                </Alert>
              )}
              {data.map((h) => (
                <Card key={h.id}>
                  <CardContent>
                    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 700, flex: 1 }}>{fmtDate(h.checkedOn)}</Typography>
                      {(h.createdBy === me.id || isStaff(role)) && canWrite && (
                        <IconButton
                          aria-label={t('common.delete')}
                          onClick={async () =>
                            (await confirm({ title: t('health.deleteConfirm'), danger: true, confirmLabel: t('common.delete') })) &&
                            run(() => remove.mutateAsync(h.id))
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {h.heightCm !== null && <Typography>{t('health.heightValue', { value: h.heightCm })}</Typography>}
                      {h.weightKg !== null && <Typography>{t('health.weightValue', { value: h.weightKg })}</Typography>}
                    </Box>
                    {h.notes && <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>{h.notes}</Typography>}
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                      {[h.needsFollowUp && t('health.needsFollowUp'), h.author && t('diary.byAuthor', { name: h.author })].filter(Boolean).join(' · ')}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <EmptyState title={t('health.empty')} text={t('health.emptyText')} />
          )
        }
      </Query>
    </Stack>
  );
}
