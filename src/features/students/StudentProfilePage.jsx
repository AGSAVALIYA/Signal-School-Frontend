import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router';
import { Alert, Box, Button, Card, CardContent, Chip, Grid, MenuItem, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { useYear } from '../../app/YearContext';
import { can } from '../../shared/utils/permissions';
import { PageHeader, Query } from '../../shared/components/ui';
import PhotoPicker from '../../shared/components/PhotoPicker';
import SectionSelect from '../../shared/components/SectionSelect';
import { useAction } from '../../shared/hooks/useNotify';
import { fmtDate, localName } from '../../shared/utils/format';
import StudentForm from './StudentForm';
import LeaveDialog from './LeaveDialog';
import DiaryList from '../diary/DiaryList';

function Info({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography sx={{ overflowWrap: 'anywhere' }}>{value}</Typography>
    </Grid>
  );
}

function Details({ s }) {
  const { t, i18n } = useTranslation();
  const f = (k) => t(`students.fields.${k}`);
  const ageText = s.age !== null ? `${t('students.ageYears', { count: s.age })}${s.dobIsApproximate ? ` (${t('students.approx')})` : ''}` : null;
  return (
    <Stack sx={{ gap: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            {t('students.sections.child')}
          </Typography>
          <Grid container spacing={2}>
            <Info label={f('grNumber')} value={s.grNumber} />
            <Info label={f('class')} value={s.enrollment?.sectionName} />
            <Info label={f('rollNumber')} value={s.enrollment?.rollNumber} />
            <Info label={f('gender')} value={s.gender && t(`students.gender.${s.gender}`)} />
            <Info label={f('dob')} value={fmtDate(s.dob)} />
            <Info label={t('students.age')} value={ageText} />
            <Info label={f('admissionDate')} value={fmtDate(s.admissionDate)} />
            <Info label={f('bloodGroup')} value={s.bloodGroup} />
            <Info label={f('aadhaarLast4')} value={s.aadhaarLast4 && `XXXX-XXXX-${s.aadhaarLast4}`} />
          </Grid>
          {s.activities?.length > 0 && (
            <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mt: 2 }}>
              {s.activities.map((a) => (
                <Chip key={a.id} label={localName(a, i18n.language)} />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            {t('students.sections.family')}
          </Typography>
          <Grid container spacing={2}>
            <Info label={f('guardianName')} value={s.guardianName} />
            <Info label={f('guardianRelation')} value={s.guardianRelation} />
            <Info label={f('guardianPhone')} value={s.guardianPhone && <a href={`tel:${s.guardianPhone}`}>{s.guardianPhone}</a>} />
            <Info label={f('guardianPhone2')} value={s.guardianPhone2} />
            <Info label={f('fatherName')} value={s.fatherName} />
            <Info label={f('motherName')} value={s.motherName} />
            <Info label={f('address')} value={s.address} />
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
}

function History({ id }) {
  const { t } = useTranslation();
  const q = useGet(`/students/${id}/history`);
  const { setYear } = useYear();
  return (
    <Query q={q}>
      {({ data }) => (
        <Stack sx={{ gap: 2 }}>
          {data.map((h) => {
            const marked = h.present + h.absent + h.leave;
            return (
              <Card key={h.enrollmentId}>
                <CardContent>
                  <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <Typography variant="h3">
                      {h.yearName} · {h.sectionName}
                    </Typography>
                    <Chip label={t(`students.enrollmentStatus.${h.status}`)} />
                  </Stack>
                  <Typography sx={{ mt: 1 }}>
                    {marked
                      ? t('students.historyAttendance', { present: h.present, total: marked, percent: Math.round((100 * h.present) / marked) })
                      : t('students.noAttendance')}
                  </Typography>
                  {h.reports?.length > 0 && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                      {h.reports.map((r) => `${r.subject} (${t(`marks.terms.${r.term}`)}): ${r.grade || r.marks || '–'}`).join(' · ')}
                    </Typography>
                  )}
                  <Button size="small" sx={{ mt: 1 }} onClick={() => setYear(h.academicYearId)}>
                    {t('students.viewYear')}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Query>
  );
}

function ReportCardLink({ id }) {
  const { t } = useTranslation();
  const [term, setTerm] = useState('S1');
  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField select label={t('marks.term')} value={term} onChange={(e) => setTerm(e.target.value)} sx={{ maxWidth: 200 }}>
        {['S1', 'S2', 'ANNUAL'].map((x) => (
          <MenuItem key={x} value={x}>
            {t(`marks.terms.${x}`)}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" component={RouterLink} to={`/report-card/${id}?term=${term}`}>
        {t('marks.openReportCard')}
      </Button>
    </Stack>
  );
}

export default function StudentProfilePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { role } = useAuth();
  const { readOnly } = useYear();
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [readmitTo, setReadmitTo] = useState(null);
  const run = useAction();
  const q = useGet(`/students/${id}`);
  const inv = ['/students', '/today', '/sections'];
  const update = useSend((body) => api.patch(`/students/${id}`, body), { invalidate: inv });
  const photo = useSend(
    (file) => {
      const fd = new FormData();
      fd.append('photo', file);
      return api.post(`/students/${id}/photo`, fd);
    },
    { invalidate: inv },
  );
  const leave = useSend((body) => api.post(`/students/${id}/leave`, body), { invalidate: inv });
  const readmit = useSend((classSectionId) => api.post(`/students/${id}/readmit`, { classSectionId }), { invalidate: inv });
  const canWrite = can(role, 'students.write') && !readOnly;

  return (
    <Query q={q}>
      {({ data: s }) => (
        <>
          <PageHeader
            back
            title={s.name}
            subtitle={[s.enrollment?.sectionName, `GR ${s.grNumber}`].filter(Boolean).join(' · ')}
            actions={
              canWrite && (
                <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setEditing(true)}>
                  {t('common.edit')}
                </Button>
              )
            }
          />
          {s.status !== 'active' && (
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              action={
                can(role, 'students.leave') && (
                  <Button color="inherit" onClick={() => setReadmitTo(s.enrollment?.classSectionId ?? null)}>
                    {t('students.readmit')}
                  </Button>
                )
              }
            >
              {t(`students.statuses.${s.status}`)} {s.leftOn && `· ${fmtDate(s.leftOn)}`} {s.leftReason && `· ${t(`students.reasons.${s.leftReason}`)}`}
            </Alert>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, alignItems: { sm: 'center' }, mb: 2 }}>
            <PhotoPicker url={s.photoUrl} name={s.name} disabled={!canWrite} onUpload={(file) => run(() => photo.mutateAsync(file), t('common.saved'))} />
            <Box sx={{ flex: 1 }} />
            {can(role, 'students.leave') && s.status === 'active' && !readOnly && (
              <Button color="warning" onClick={() => setLeaving(true)}>
                {t('students.markLeft')}
              </Button>
            )}
          </Stack>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Tab label={t('students.tabs.details')} />
            <Tab label={t('students.tabs.diary')} />
            <Tab label={t('students.tabs.history')} />
            <Tab label={t('students.tabs.reportCard')} />
          </Tabs>
          {tab === 0 && <Details s={s} />}
          {tab === 1 && <DiaryList studentId={s.id} canWrite={can(role, 'diary.write') && !readOnly && s.status === 'active'} />}
          {tab === 2 && <History id={s.id} />}
          {tab === 3 && <ReportCardLink id={s.id} />}
          {editing && <StudentForm student={s} onClose={() => setEditing(false)} onSubmit={(body) => update.mutateAsync(body)} />}
          {leaving && (
            <LeaveDialog name={s.name} onClose={() => setLeaving(false)} onSubmit={(body) => run(() => leave.mutateAsync(body), t('common.saved'))} />
          )}
          {readmitTo !== null && (
            <Card sx={{ p: 2, mt: 2 }}>
              <Stack direction="row" sx={{ gap: 2, flexWrap: 'wrap' }}>
                <SectionSelect value={readmitTo} onChange={setReadmitTo} sx={{ maxWidth: 260 }} />
                <Button
                  variant="contained"
                  disabled={!readmitTo}
                  onClick={async () => (await run(() => readmit.mutateAsync(readmitTo), t('common.saved'))) && setReadmitTo(null)}
                >
                  {t('students.readmit')}
                </Button>
                <Button onClick={() => setReadmitTo(null)}>{t('common.cancel')}</Button>
              </Stack>
            </Card>
          )}
        </>
      )}
    </Query>
  );
}
