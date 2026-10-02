import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import { Autorenew as AutorenewIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useYear } from '../../app/YearContext';
import { EmptyState, HelpTip, PageHeader } from '../../shared/components/ui';
import { useAction } from '../../shared/hooks/useNotify';
import { useConfirm } from '../../shared/hooks/useConfirm';
import { fmtDate, fmtDateTime } from '../../shared/utils/format';

const COLOR = { active: 'success', planned: 'info', closed: 'default' };

function YearDialog({ year, onClose, onSave }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: year?.name || '', startDate: year?.startDate || '', endDate: year?.endDate || '' });
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{year ? t('years.edit') : t('years.add')}</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <TextField label={t('years.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="2026-27" />
          <TextField
            type="date"
            label={t('years.start')}
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            type="date"
            label={t('years.end')}
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="contained" disabled={!form.name || !form.startDate || !form.endDate} onClick={async () => (await onSave(form)) && onClose()}>
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function UnlockDialog({ year, onClose, onSave }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ minutes: 60, reason: '' });
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{t('years.unlockTitle', { name: year.name })}</DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <Typography sx={{ color: 'text.secondary' }}>{t('years.unlockText')}</Typography>
          <TextField
            type="number"
            label={t('years.unlockMinutes')}
            value={form.minutes}
            onChange={(e) => setForm({ ...form, minutes: Number(e.target.value) })}
            slotProps={{ htmlInput: { min: 5, max: 240 } }}
          />
          <TextField label={t('years.unlockReason')} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="contained" disabled={form.reason.trim().length < 3} onClick={async () => (await onSave(form)) && onClose()}>
          {t('years.unlock')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function YearsPage() {
  const { t } = useTranslation();
  const { years, current, refetch } = useYear();
  const run = useAction();
  const confirm = useConfirm();
  const [editing, setEditing] = useState(null);
  const [unlocking, setUnlocking] = useState(null);
  const inv = ['/academic-years', '/sections', '/today', '/dashboard', '/students'];
  const opts = { invalidate: inv, onSuccess: () => refetch() };
  const create = useSend((body) => api.post('/academic-years', body), opts);
  const update = useSend(({ id, ...body }) => api.patch(`/academic-years/${id}`, body), opts);
  const action = useSend(({ id, verb, body }) => api.post(`/academic-years/${id}/${verb}`, body), opts);
  const remove = useSend((id) => api.delete(`/academic-years/${id}`), opts);

  return (
    <>
      <PageHeader
        title={t('nav.years')}
        help={t('help.years')}
        actions={
          <>
            {current && (
              <Button variant="contained" startIcon={<AutorenewIcon />} component={RouterLink} to="/years/new">
                {t('years.startNew')}
              </Button>
            )}
            <Button variant="outlined" onClick={() => setEditing({})}>
              {t('years.add')}
            </Button>
          </>
        }
      />
      {!years.length ? (
        <EmptyState
          title={t('years.none')}
          text={t('years.noneText')}
          action={
            <Button variant="contained" onClick={() => setEditing({})}>
              {t('years.add')}
            </Button>
          }
        />
      ) : (
        <Grid container spacing={2}>
          {years.map((y) => (
            <Grid size={{ xs: 12, md: 6 }} key={y.id}>
              <Card>
                <CardContent sx={{ display: 'grid', gap: 1 }}>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                    <Typography variant="h3" sx={{ flex: 1 }}>
                      {y.name}
                    </Typography>
                    <Chip color={COLOR[y.status]} label={t(`year.status.${y.status}`)} />
                  </Stack>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {fmtDate(y.startDate)} – {fmtDate(y.endDate)}
                  </Typography>
                  <Typography>{t('years.counts', { sections: y.sectionCount, students: y.studentCount })}</Typography>
                  {y.unlockedUntil && new Date(y.unlockedUntil) > new Date() && (
                    <Chip color="warning" label={t('years.unlockedUntil', { time: fmtDateTime(y.unlockedUntil) })} />
                  )}
                  <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    <Button size="small" onClick={() => setEditing(y)}>
                      {t('common.edit')}
                    </Button>
                    {y.status !== 'active' && (
                      <Button
                        size="small"
                        onClick={async () =>
                          (await confirm({
                            title: t('years.activateConfirm', { name: y.name }),
                            text: current ? t('years.activateText', { name: current.name }) : null,
                          })) && run(() => action.mutateAsync({ id: y.id, verb: 'activate' }), t('common.saved'))
                        }
                      >
                        {t('years.activate')}
                      </Button>
                    )}
                    {y.status === 'active' && (
                      <Button
                        size="small"
                        onClick={async () =>
                          (await confirm({ title: t('years.closeConfirm', { name: y.name }), text: t('years.closeText') })) &&
                          run(() => action.mutateAsync({ id: y.id, verb: 'close' }), t('common.saved'))
                        }
                      >
                        {t('years.close')}
                      </Button>
                    )}
                    {y.status === 'closed' && (
                      <Button size="small" onClick={() => setUnlocking(y)}>
                        {t('years.unlock')}
                      </Button>
                    )}
                    {y.status === 'planned' && !y.studentCount && (
                      <Button
                        size="small"
                        color="error"
                        onClick={async () =>
                          (await confirm({ title: t('years.deleteConfirm', { name: y.name }), danger: true, confirmLabel: t('common.delete') })) &&
                          run(() => remove.mutateAsync(y.id), t('common.saved'))
                        }
                      >
                        {t('common.delete')}
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <HelpTip text={t('help.yearsHistory')} />
      {editing && (
        <YearDialog
          year={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={(form) => run(() => (editing.id ? update.mutateAsync({ id: editing.id, ...form }) : create.mutateAsync(form)), t('common.saved'))}
        />
      )}
      {unlocking && (
        <UnlockDialog
          year={unlocking}
          onClose={() => setUnlocking(null)}
          onSave={(body) => run(() => action.mutateAsync({ id: unlocking.id, verb: 'unlock', body }), t('common.saved'))}
        />
      )}
    </>
  );
}
