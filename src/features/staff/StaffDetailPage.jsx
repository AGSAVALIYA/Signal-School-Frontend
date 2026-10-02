import { useState } from 'react';
import { useParams } from 'react-router';
import { Button, Card, CardContent, Chip, IconButton, List, ListItem, ListItemText, MenuItem, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { EmptyState, PageHeader, Query } from '../../shared/components/ui';
import { useSections } from '../../shared/components/SectionSelect';
import { useAction } from '../../shared/hooks/useNotify';
import { useConfirm } from '../../shared/hooks/useConfirm';
import { fmtDateTime } from '../../shared/utils/format';
import TempPasswordDialog from './TempPasswordDialog';
import { ROLES } from './StaffPage';

function Profile({ u }) {
  const { t } = useTranslation();
  const { role: myRole, me } = useAuth();
  const run = useAction();
  const confirm = useConfirm();
  const [form, setForm] = useState({ name: u.name, phone: u.phone || '', email: u.email || '', role: u.role });
  const [temp, setTemp] = useState(null);
  const inv = ['/users'];
  const save = useSend((body) => api.patch(`/users/${u.id}`, body), { invalidate: inv });
  const reset = useSend(() => api.post(`/users/${u.id}/reset-password`), { invalidate: inv });
  const toggle = useSend(() => api.post(`/users/${u.id}/${u.status === 'active' ? 'deactivate' : 'activate'}`), { invalidate: inv });
  const self = u.id === me.id;
  return (
    <Card>
      <CardContent sx={{ display: 'grid', gap: 2 }}>
        <TextField label={t('common.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextField label={t('staff.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" />
        <TextField label={t('staff.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
        <TextField select label={t('staff.role')} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} disabled={self}>
          {ROLES.filter((r) => r !== 'owner' || myRole === 'owner').map((r) => (
            <MenuItem key={r} value={r}>
              {t(`staff.roles.${r}`)}
            </MenuItem>
          ))}
        </TextField>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('staff.lastLogin', { when: u.lastLoginAt ? fmtDateTime(u.lastLoginAt) : t('staff.never') })}
        </Typography>
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={() => run(() => save.mutateAsync({ ...form, email: form.email || null, phone: form.phone || null }), t('common.saved'))}
          >
            {t('common.save')}
          </Button>
          <Button
            onClick={async () => {
              if (!(await confirm({ title: t('staff.resetConfirm', { name: u.name }) }))) return;
              const r = await run(() => reset.mutateAsync());
              if (r) setTemp(r.data.tempPassword);
            }}
          >
            {t('staff.resetPassword')}
          </Button>
          {!self && (
            <Button
              color={u.status === 'active' ? 'error' : 'success'}
              onClick={async () =>
                (await confirm({
                  title: t(u.status === 'active' ? 'staff.deactivateConfirm' : 'staff.activateConfirm', { name: u.name }),
                  danger: u.status === 'active',
                })) && run(() => toggle.mutateAsync(), t('common.saved'))
              }
            >
              {u.status === 'active' ? t('staff.deactivate') : t('staff.activate')}
            </Button>
          )}
        </Stack>
      </CardContent>
      {temp && <TempPasswordDialog name={u.name} login={u.phone || u.email} password={temp} onClose={() => setTemp(null)} />}
    </Card>
  );
}

function Assignments({ u }) {
  const { t } = useTranslation();
  const run = useAction();
  const { sections } = useSections();
  const q = useGet('/assignments', { userId: u.id });
  const [form, setForm] = useState({ classSectionId: '', subjectId: '', role: 'subject_teacher' });
  const inv = ['/assignments', '/sections', '/today'];
  const add = useSend((body) => api.post('/assignments', body), { invalidate: inv });
  const remove = useSend((id) => api.delete(`/assignments/${id}`), { invalidate: inv });
  const subjects = sections.find((s) => s.id === form.classSectionId)?.Subjects || [];
  return (
    <Stack sx={{ gap: 2 }}>
      <Card sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            select
            label={t('students.fields.class')}
            value={form.classSectionId}
            onChange={(e) => setForm({ ...form, classSectionId: e.target.value, subjectId: '' })}
          >
            {sections.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label={t('staff.assignmentRole')} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {['class_teacher', 'subject_teacher'].map((r) => (
              <MenuItem key={r} value={r}>
                {t(`staff.assignmentRoles.${r}`)}
              </MenuItem>
            ))}
          </TextField>
          {form.role === 'subject_teacher' && (
            <TextField select label={t('marks.subject')} value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
              {subjects.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Button
            variant="contained"
            disabled={!form.classSectionId || (form.role === 'subject_teacher' && !form.subjectId)}
            onClick={async () =>
              (await run(
                () => add.mutateAsync({ userId: u.id, classSectionId: form.classSectionId, role: form.role, subjectId: form.subjectId || null }),
                t('common.saved'),
              )) && setForm({ classSectionId: '', subjectId: '', role: 'subject_teacher' })
            }
          >
            {t('common.add')}
          </Button>
        </Stack>
      </Card>
      <Query q={q}>
        {({ data }) =>
          data.length ? (
            <Card>
              <List disablePadding>
                {data.map((a) => (
                  <ListItem
                    key={a.id}
                    divider
                    secondaryAction={
                      <IconButton aria-label={t('common.delete')} onClick={() => run(() => remove.mutateAsync(a.id))}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${a.ClassSection?.name}${a.Subject ? ` · ${a.Subject.name}` : ''}`}
                      secondary={t(`staff.assignmentRoles.${a.role}`)}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          ) : (
            <EmptyState title={t('staff.noAssignments')} />
          )
        }
      </Query>
    </Stack>
  );
}

function Activity({ u }) {
  const { t } = useTranslation();
  const q = useGet(`/users/${u.id}/activity`);
  return (
    <Query q={q}>
      {({ data }) =>
        data.length ? (
          <Card>
            <List disablePadding>
              {data.map((l) => (
                <ListItem key={l.id} divider>
                  <ListItemText
                    primary={t(`audit.actions.${l.action}`, { defaultValue: l.action })}
                    secondary={`${fmtDateTime(l.createdAt)}${l.summary ? ` · ${l.summary}` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        ) : (
          <EmptyState title={t('audit.none')} />
        )
      }
    </Query>
  );
}

export default function StaffDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const q = useGet('/users', { status: undefined });
  return (
    <Query q={q}>
      {({ data }) => {
        const u = data.find((x) => String(x.id) === id);
        if (!u) return <EmptyState title={t('errors.NOT_FOUND')} />;
        return (
          <>
            <PageHeader back="/staff" title={u.name} actions={<Chip label={`${t(`staff.roles.${u.role}`)} · ${t(`staff.${u.status}`)}`} />} />
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Tab label={t('staff.tabs.profile')} />
              <Tab label={t('staff.tabs.assignments')} />
              <Tab label={t('staff.tabs.activity')} />
            </Tabs>
            {tab === 0 && <Profile u={u} />}
            {tab === 1 && <Assignments u={u} />}
            {tab === 2 && <Activity u={u} />}
          </>
        );
      }}
    </Query>
  );
}
