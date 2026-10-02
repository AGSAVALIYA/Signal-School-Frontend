import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon, ArrowDownward as ArrowDownwardIcon, ArrowUpward as ArrowUpwardIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useYear } from '../../app/YearContext';
import { EmptyState, PageHeader, Query } from '../../shared/components/ui';
import { useAction } from '../../shared/hooks/useNotify';
import { useConfirm } from '../../shared/hooks/useConfirm';
import SectionSelect from '../../shared/components/SectionSelect';

const INV = ['/sections', '/grades', '/activities', '/assignments', '/today', '/dashboard'];

function AddInline({ label, onAdd, children }) {
  const { t } = useTranslation();
  const [v, setV] = useState('');
  return (
    <Stack
      component="form"
      direction="row"

      onSubmit={async (e) => {
        e.preventDefault();
        if (v.trim() && (await onAdd(v.trim()))) setV('');
      }}
      sx={{ gap: 1 }}
    >
      {children}
      <TextField size="small" label={label} value={v} onChange={(e) => setV(e.target.value)} />
      <Button type="submit" startIcon={<AddIcon />} disabled={!v.trim()}>
        {t('common.add')}
      </Button>
    </Stack>
  );
}

function SectionCard({ s, teachers, readOnly }) {
  const { t } = useTranslation();
  const run = useAction();
  const confirm = useConfirm();
  const [name, setName] = useState(s.name);
  const rename = useSend((n) => api.patch(`/sections/${s.id}`, { name: n }), { invalidate: INV });
  const remove = useSend(() => api.delete(`/sections/${s.id}`), { invalidate: INV });
  const addSubject = useSend((n) => api.post('/subjects', { classSectionId: s.id, name: n }), { invalidate: INV });
  const removeSubject = useSend((id) => api.delete(`/subjects/${id}`), { invalidate: INV });
  const setTeacher = useSend((userId) => api.post('/assignments', { userId, classSectionId: s.id, role: 'class_teacher' }), { invalidate: INV });
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'grid', gap: 2 }}>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            label={t('classes.sectionName')}
            value={name}
            disabled={readOnly}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => name.trim() && name !== s.name && run(() => rename.mutateAsync(name.trim()), t('common.saved'))}
          />
          <IconButton
            aria-label={t('common.delete')}
            disabled={readOnly}
            onClick={async () =>
              (await confirm({
                title: t('classes.deleteSection', { name: s.name }),
                text: s.studentCount ? t('classes.sectionInUse', { count: s.studentCount }) : null,
                danger: true,
                confirmLabel: t('common.delete'),
              })) && run(() => remove.mutateAsync())
            }
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
        <Typography sx={{ color: 'text.secondary' }}>
          {s.Grade?.name} · {t('classes.studentCount', { count: s.studentCount })}
        </Typography>
        <TextField
          select
          size="small"
          label={t('classes.classTeacher')}
          value={s.classTeacher?.id ?? ''}
          disabled={readOnly}
          onChange={(e) => run(() => setTeacher.mutateAsync(Number(e.target.value)), t('common.saved'))}
        >
          {teachers.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.name}
            </MenuItem>
          ))}
        </TextField>
        <Box>
          <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
            {t('classes.subjects')}
          </Typography>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mb: 1 }}>
            {s.Subjects.map((sub) => (
              <Chip
                key={sub.id}
                label={sub.name}
                onDelete={
                  readOnly
                    ? undefined
                    : async () =>
                        (await confirm({ title: t('classes.deleteSubject', { name: sub.name }), danger: true, confirmLabel: t('common.delete') })) &&
                        run(() => removeSubject.mutateAsync(sub.id))
                }
              />
            ))}
          </Stack>
          {!readOnly && <AddInline label={t('classes.subjectName')} onAdd={(n) => run(() => addSubject.mutateAsync(n))} />}
        </Box>
      </CardContent>
    </Card>
  );
}

function SectionsTab() {
  const { t } = useTranslation();
  const { readOnly } = useYear();
  const run = useAction();
  const sections = useGet('/sections');
  const grades = useGet('/grades');
  const teachers = useGet('/users', { role: 'teacher', status: 'active' });
  const [gradeId, setGradeId] = useState('');
  const add = useSend((name) => api.post('/sections', { gradeId, name }), { invalidate: INV });
  return (
    <Stack sx={{ gap: 2 }}>
      {!readOnly && (
        <Card sx={{ p: 2 }}>
          <AddInline label={t('classes.sectionName')} onAdd={(n) => gradeId && run(() => add.mutateAsync(n), t('common.saved'))}>
            <TextField select size="small" label={t('classes.grade')} value={gradeId} onChange={(e) => setGradeId(e.target.value)} sx={{ minWidth: 160 }}>
              {(grades.data?.data || []).map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </TextField>
          </AddInline>
        </Card>
      )}
      <Query q={sections}>
        {({ data }) =>
          data.length ? (
            <Grid container spacing={2}>
              {data.map((s) => (
                <Grid size={{ xs: 12, md: 6 }} key={s.id}>
                  <SectionCard s={s} teachers={teachers.data?.data || []} readOnly={readOnly} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <EmptyState title={t('classes.noSections')} text={t('classes.noSectionsText')} />
          )
        }
      </Query>
    </Stack>
  );
}

function GradesTab() {
  const { t } = useTranslation();
  const run = useAction();
  const confirm = useConfirm();
  const q = useGet('/grades');
  const add = useSend((name) => api.post('/grades', { name }), { invalidate: INV });
  const patch = useSend(({ id, ...body }) => api.patch(`/grades/${id}`, body), { invalidate: INV });
  const order = useSend((list) => api.put('/grades/order', list), { invalidate: INV });
  const remove = useSend((id) => api.delete(`/grades/${id}`), { invalidate: INV });
  return (
    <Query q={q}>
      {({ data }) => {
        const move = (i, d) => {
          const j = i + d;
          if (j < 0 || j >= data.length) return;
          const list = data.map((g, k) => ({ id: g.id, sortOrder: k === i ? j : k === j ? i : k }));
          run(() => order.mutateAsync(list));
        };
        return (
          <Stack sx={{ gap: 2 }}>
            <Typography sx={{ color: 'text.secondary' }}>{t('classes.gradesHelp')}</Typography>
            <Card>
              <List disablePadding>
                {data.map((g, i) => (
                  <ListItem key={g.id} divider sx={{ gap: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ flex: 1, minWidth: 120, fontWeight: 600 }}>{g.name}</Typography>
                    <TextField
                      select
                      size="small"
                      label={t('classes.nextGrade')}
                      value={g.nextGradeId ?? ''}
                      disabled={g.isFinal}
                      onChange={(e) => run(() => patch.mutateAsync({ id: g.id, nextGradeId: e.target.value || null }))}
                      sx={{ minWidth: 160 }}
                      fullWidth={false}
                    >
                      <MenuItem value="">–</MenuItem>
                      {data
                        .filter((x) => x.id !== g.id)
                        .map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            {x.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={g.isFinal}
                          onChange={(e) =>
                            run(() => patch.mutateAsync({ id: g.id, isFinal: e.target.checked, ...(e.target.checked ? { nextGradeId: null } : {}) }))
                          }
                        />
                      }
                      label={t('classes.finalGrade')}
                    />
                    <IconButton aria-label={t('common.moveUp')} onClick={() => move(i, -1)}>
                      <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton aria-label={t('common.moveDown')} onClick={() => move(i, 1)}>
                      <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton
                      aria-label={t('common.delete')}
                      onClick={async () =>
                        (await confirm({ title: t('classes.deleteGrade', { name: g.name }), danger: true, confirmLabel: t('common.delete') })) &&
                        run(() => remove.mutateAsync(g.id))
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Card>
            <AddInline label={t('classes.gradeName')} onAdd={(n) => run(() => add.mutateAsync(n))} />
          </Stack>
        );
      }}
    </Query>
  );
}

function MembersDialog({ group, onClose }) {
  const { t } = useTranslation();
  const run = useAction();
  const [sectionId, setSectionId] = useState(null);
  const students = useGet('/students', { pageSize: 100, status: 'active', sectionId: sectionId || undefined });
  const current = useGet(`/activities/${group.id}/members`);
  const [picked, setPicked] = useState(null);
  const ids = picked ?? new Set(current.data?.data || []);
  const save = useSend((enrollmentIds) => api.put(`/activities/${group.id}/members`, { enrollmentIds }), { invalidate: INV });
  const toggle = (id) => {
    const next = new Set(ids);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPicked(next);
  };
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{t('classes.members', { name: group.name })}</DialogTitle>
      <DialogContent dividers>
        <SectionSelect allowAll value={sectionId} onChange={setSectionId} size="small" sx={{ mb: 1 }} />
        <Query q={students}>
          {({ data }) =>
            data.map((s) => (
              <FormControlLabel
                key={s.id}
                sx={{ display: 'flex' }}
                control={<Checkbox checked={ids.has(s.enrollment?.id)} onChange={() => toggle(s.enrollment?.id)} />}
                label={`${s.name} · ${s.enrollment?.sectionName || ''}`}
              />
            ))
          }
        </Query>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="contained" onClick={async () => (await run(() => save.mutateAsync([...ids].filter(Boolean)), t('common.saved'))) && onClose()}>
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ActivitiesTab() {
  const { t } = useTranslation();
  const run = useAction();
  const confirm = useConfirm();
  const [open, setOpen] = useState(null);
  const q = useGet('/activities');
  const add = useSend((name) => api.post('/activities', { name }), { invalidate: INV });
  const remove = useSend((id) => api.delete(`/activities/${id}`), { invalidate: INV });
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography sx={{ color: 'text.secondary' }}>{t('classes.activitiesHelp')}</Typography>
      <Query q={q}>
        {({ data }) => (
          <Card>
            <List disablePadding>
              {data.map((g) => (
                <ListItem key={g.id} divider sx={{ gap: 1 }}>
                  <Typography sx={{ flex: 1 }}>{g.name}</Typography>
                  <Button onClick={() => setOpen(g)}>{t('classes.memberCount', { count: g.memberCount })}</Button>
                  <IconButton
                    aria-label={t('common.delete')}
                    onClick={async () =>
                      (await confirm({ title: t('classes.deleteActivity', { name: g.name }), danger: true, confirmLabel: t('common.delete') })) &&
                      run(() => remove.mutateAsync(g.id))
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Card>
        )}
      </Query>
      <AddInline label={t('classes.activityName')} onAdd={(n) => run(() => add.mutateAsync(n))} />
      {open && <MembersDialog group={open} onClose={() => setOpen(null)} />}
    </Stack>
  );
}

export default function ClassesPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  return (
    <>
      <PageHeader title={t('nav.classesSubjects')} />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }} variant="scrollable">
        <Tab label={t('classes.tabs.sections')} />
        <Tab label={t('classes.tabs.grades')} />
        <Tab label={t('classes.tabs.activities')} />
      </Tabs>
      {tab === 0 && <SectionsTab />}
      {tab === 1 && <GradesTab />}
      {tab === 2 && <ActivitiesTab />}
    </>
  );
}
