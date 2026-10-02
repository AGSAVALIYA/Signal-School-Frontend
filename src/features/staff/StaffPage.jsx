import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { EmptyState, PageHeader, Query } from '../../shared/components/ui';
import { useNotify } from '../../shared/hooks/useNotify';
import { initials } from '../../shared/utils/format';
import TempPasswordDialog from './TempPasswordDialog';

export const ROLES = ['teacher', 'clerk', 'admin', 'owner'];

function AddDialog({ onClose, onCreated }) {
  const { t } = useTranslation();
  const notify = useNotify();
  const { role: myRole } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'teacher' });
  const create = useSend((body) => api.post('/users', body), { invalidate: ['/users'] });
  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await create.mutateAsync({ ...form, email: form.email || null, phone: form.phone || null });
      onCreated(data);
    } catch (err) {
      notify.error(err);
    }
  };
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{t('staff.add')}</DialogTitle>
      <DialogContent>
        <Stack component="form" id="add-user" onSubmit={submit} sx={{ gap: 2, pt: 1 }}>
          <TextField label={t('common.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
          <TextField
            label={t('staff.phone')}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            type="tel"
            helperText={t('staff.contactHelp')}
          />
          <TextField label={t('staff.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
          <TextField select label={t('staff.role')} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {ROLES.filter((r) => r !== 'owner' || myRole === 'owner').map((r) => (
              <MenuItem key={r} value={r}>
                {t(`staff.roles.${r}`)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button type="submit" form="add-user" variant="contained" disabled={create.isPending || !form.name || !(form.email || form.phone)}>
          {t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function StaffPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('active');
  const [adding, setAdding] = useState(false);
  const [created, setCreated] = useState(null);
  const q = useGet('/users', { status });
  return (
    <>
      <PageHeader
        title={t('nav.staff')}
        actions={
          <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setAdding(true)}>
            {t('staff.add')}
          </Button>
        }
      />
      <Tabs value={status} onChange={(_, v) => setStatus(v)} sx={{ mb: 2 }}>
        <Tab value="active" label={t('staff.active')} />
        <Tab value="inactive" label={t('staff.inactive')} />
      </Tabs>
      <Query q={q}>
        {({ data }) =>
          data.length ? (
            <Card>
              <List disablePadding>
                {data.map((u) => (
                  <ListItemButton key={u.id} divider onClick={() => navigate(`/staff/${u.id}`)}>
                    <ListItemAvatar>
                      <Avatar src={u.photoUrl || undefined}>{initials(u.name)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={u.name} secondary={[u.phone, u.email].filter(Boolean).join(' · ')} />
                    <Chip label={t(`staff.roles.${u.role}`)} />
                  </ListItemButton>
                ))}
              </List>
            </Card>
          ) : (
            <EmptyState title={t('staff.none')} />
          )
        }
      </Query>
      {adding && (
        <AddDialog
          onClose={() => setAdding(false)}
          onCreated={(d) => {
            setAdding(false);
            setCreated(d);
          }}
        />
      )}
      {created &&
        (created.tempPassword ? (
          <TempPasswordDialog
            name={created.user.name}
            login={created.user.phone || created.user.email}
            password={created.tempPassword}
            onClose={() => setCreated(null)}
          />
        ) : (
          <Dialog open onClose={() => setCreated(null)}>
            <DialogContent>
              <Typography>{t('staff.linkedExisting', { name: created.user.name })}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCreated(null)}>{t('common.close')}</Button>
            </DialogActions>
          </Dialog>
        ))}
    </>
  );
}
