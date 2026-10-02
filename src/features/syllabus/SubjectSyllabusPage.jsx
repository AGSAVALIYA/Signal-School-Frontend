import { useState } from 'react';
import { useParams } from 'react-router';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Edit as EditIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { useYear } from '../../app/YearContext';
import { can, isStaff } from '../../shared/utils/permissions';
import { EmptyState, PageHeader, ProgressBar, Query } from '../../shared/components/ui';
import { useAction } from '../../shared/hooks/useNotify';
import { fmtDate, todayISO } from '../../shared/utils/format';
import SyllabusEditor from './SyllabusEditor';

function TopicRow({ topic, canTick, onTick, onUntick, me, staff }) {
  const { t } = useTranslation();
  const done = topic.completion;
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap', py: 1, borderBottom: 1, borderColor: 'divider' }}>
      {done ? <CheckCircleIcon color="success" /> : <Box sx={{ width: 24 }} />}
      <Box sx={{ flex: 1, minWidth: 160 }}>
        <Typography>{topic.content}</Typography>
        {done && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('syllabus.taughtOnBy', { date: fmtDate(done.completedOn), name: done.teacher?.name || '–' })}
          </Typography>
        )}
      </Box>
      {canTick &&
        (done ? (
          (staff || done.completedBy === me.id) && (
            <Button size="small" onClick={onUntick}>
              {t('syllabus.markNotTaught')}
            </Button>
          )
        ) : (
          <Button size="small" variant="contained" onClick={onTick}>
            {t('syllabus.markTaught')}
          </Button>
        ))}
    </Stack>
  );
}

export default function SubjectSyllabusPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { me, role } = useAuth();
  const { readOnly } = useYear();
  const staff = isStaff(role);
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [teacherId, setTeacherId] = useState('');
  const run = useAction();
  const q = useGet(`/syllabus/subjects/${id}`);
  const teachers = useGet(staff ? '/users' : null, { role: 'teacher', status: 'active' });
  const inv = ['/syllabus', '/today', '/dashboard'];
  const save = useSend((body) => api.put(`/syllabus/subjects/${id}`, body), { invalidate: inv });
  const tick = useSend((topicId) => api.post(`/syllabus/topics/${topicId}/complete`, { date, ...(teacherId ? { teacherId } : {}) }), { invalidate: inv });
  const untick = useSend((topicId) => api.delete(`/syllabus/topics/${topicId}/complete`), { invalidate: inv });
  const canTick = can(role, 'syllabus.complete') && !readOnly;

  return (
    <Query q={q}>
      {({ data }) => (
        <>
          <PageHeader
            back
            title={`${data.subject.name} · ${data.subject.ClassSection?.name || ''}`}
            subtitle={t('syllabus.progressText', data.progress)}
            actions={
              can(role, 'syllabus.edit') &&
              !readOnly &&
              !editing && (
                <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setEditing(true)}>
                  {t('syllabus.edit')}
                </Button>
              )
            }
          />
          <Box sx={{ mb: 2 }}>
            <ProgressBar percent={data.progress.percent} />
          </Box>
          {editing ? (
            <SyllabusEditor
              chapters={data.chapters}
              saving={save.isPending}
              onCancel={() => setEditing(false)}
              onSave={async (body) => (await run(() => save.mutateAsync(body), t('common.saved'))) && setEditing(false)}
            />
          ) : data.chapters.length ? (
            <>
              {canTick && (
                <Stack direction="row" sx={{ gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  <TextField
                    type="date"
                    label={t('syllabus.taughtOn')}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    sx={{ maxWidth: 200 }}
                    slotProps={{ htmlInput: { max: todayISO() }, inputLabel: { shrink: true } }}
                  />
                  {staff && (
                    <TextField select label={t('syllabus.teacher')} value={teacherId} onChange={(e) => setTeacherId(e.target.value)} sx={{ maxWidth: 240 }}>
                      <MenuItem value="">{t('syllabus.me')}</MenuItem>
                      {(teachers.data?.data || []).map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Stack>
              )}
              {data.chapters.map((c) => {
                const done = c.Topics.filter((x) => x.completion).length;
                return (
                  <Accordion key={c.id} defaultExpanded={done < c.Topics.length} disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 700, flex: 1 }}>{c.name}</Typography>
                      <Typography sx={{ color: 'text.secondary', mr: 1 }}>
                        {done}/{c.Topics.length}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {c.Topics.map((x) => (
                        <TopicRow
                          key={x.id}
                          topic={x}
                          me={me}
                          staff={staff}
                          canTick={canTick}
                          onTick={() => run(() => tick.mutateAsync(x.id))}
                          onUntick={() => run(() => untick.mutateAsync(x.id))}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </>
          ) : (
            <EmptyState
              title={t('syllabus.empty')}
              action={
                can(role, 'syllabus.edit') &&
                !readOnly && (
                  <Button variant="contained" onClick={() => setEditing(true)}>
                    {t('syllabus.addChapter')}
                  </Button>
                )
              }
            />
          )}
        </>
      )}
    </Query>
  );
}
