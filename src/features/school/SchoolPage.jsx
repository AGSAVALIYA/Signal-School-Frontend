import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { can } from '../../shared/utils/permissions';
import { PageHeader, Query } from '../../shared/components/ui';
import { PhotoInput } from '../../shared/components/PhotoPicker';
import { LANGUAGES } from '../../i18n';
import { useAction } from '../../shared/hooks/useNotify';
import useDraft from '../../shared/hooks/useDraft';

const DAYS = [0, 1, 2, 3, 4, 5, 6];

function SchoolForm({ school }) {
  const { t } = useTranslation();
  const run = useAction();
  const [form, setForm] = useDraft(school);
  const save = useSend((body) => api.patch('/school', body), { invalidate: ['/school', '/schools'] });
  const logo = useSend(
    (file) => {
      const fd = new FormData();
      fd.append('logo', file, 'logo.jpg');
      return api.post('/school/logo', fd);
    },
    { invalidate: ['/school'] },
  );
  const f = (k, label, props = {}) => (
    <TextField
      label={label}
      value={form[k] ?? ''}
      onChange={(e) => setForm({ ...form, [k]: props.type === 'number' ? Number(e.target.value) : e.target.value })}
      {...props}
    />
  );
  const submit = () => {
    const { name, address, contactNumber, location, udiseCode, defaultLanguage, grPrefix, attendanceEditDays, weeklyOffs } = form;
    return run(
      () => save.mutateAsync({ name, address, contactNumber, location, udiseCode, defaultLanguage, grPrefix, attendanceEditDays, weeklyOffs }),
      t('common.saved'),
    );
  };
  return (
    <Card>
      <CardContent sx={{ display: 'grid', gap: 2 }}>
        <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
          <Avatar src={school.logoUrl || undefined} variant="rounded" sx={{ width: 72, height: 72 }} />
          <PhotoInput onFile={(file) => run(() => logo.mutateAsync(file), t('common.saved'))}>
            {(open) => <Button onClick={open}>{t('school.uploadLogo')}</Button>}
          </PhotoInput>
        </Stack>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>{f('name', t('school.name'))}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{f('location', t('school.location'))}</Grid>
          <Grid size={{ xs: 12 }}>{f('address', t('school.address'))}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{f('contactNumber', t('school.contactNumber'))}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{f('udiseCode', t('school.udiseCode'))}</Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {f('defaultLanguage', t('school.defaultLanguage'), {
              select: true,
              children: LANGUAGES.map((l) => (
                <MenuItem key={l.code} value={l.code}>
                  {l.native}
                </MenuItem>
              )),
            })}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {f('grPrefix', t('school.grPrefix'), { helperText: t('school.grPrefixHelp', { example: `${form.grPrefix || ''}${form.nextGrNumber}` }) })}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>{f('attendanceEditDays', t('school.editDays'), { type: 'number', helperText: t('school.editDaysHelp') })}</Grid>
        </Grid>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('school.weeklyOffs')}
          </Typography>
          {DAYS.map((d) => (
            <FormControlLabel
              key={d}
              control={
                <Checkbox
                  checked={form.weeklyOffs?.includes(d) || false}
                  onChange={(e) => setForm({ ...form, weeklyOffs: e.target.checked ? [...form.weeklyOffs, d] : form.weeklyOffs.filter((x) => x !== d) })}
                />
              }
              label={t(`days.${d}`)}
            />
          ))}
        </Box>
        <Button variant="contained" onClick={submit} sx={{ justifySelf: 'start' }}>
          {t('common.save')}
        </Button>
      </CardContent>
    </Card>
  );
}

function Organization() {
  const { t } = useTranslation();
  const run = useAction();
  const { switchSchool, refreshMe, school } = useAuth();
  const org = useGet('/organization');
  const schools = useGet('/schools');
  const summary = useGet('/organization/summary');
  const [name, setName] = useState('');
  const add = useSend((body) => api.post('/schools', body), { invalidate: ['/schools', '/organization'], onSuccess: () => refreshMe() });
  return (
    <Stack sx={{ gap: 2 }}>
      <Query q={org}>{({ data }) => <Typography variant="h2">{data.name}</Typography>}</Query>
      <Query q={summary}>
        {({ data }) => (
          <Card sx={{ overflowX: 'auto' }} tabIndex={0} role="region" aria-label={t('school.tabs.organization')}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('school.name')}</TableCell>
                  <TableCell align="right">{t('dashboard.students')}</TableCell>
                  <TableCell align="right">{t('dashboard.teachers')}</TableCell>
                  <TableCell align="right">{t('school.attendance30')}</TableCell>
                  <TableCell align="right">{t('school.syllabusPercent')}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      {s.name} {s.status === 'archived' && <Chip size="small" label={t('school.archived')} />}
                    </TableCell>
                    <TableCell align="right">{s.students}</TableCell>
                    <TableCell align="right">{s.teachers}</TableCell>
                    <TableCell align="right">{s.attendance_rate_30d ?? '–'}%</TableCell>
                    <TableCell align="right">{s.syllabus_percent ?? '–'}%</TableCell>
                    <TableCell align="right">
                      {school?.id === s.id ? (
                        <Chip size="small" color="primary" label={t('school.current')} />
                      ) : (
                        (schools.data?.data || []).some((x) => x.id === s.id && x.status === 'active') && (
                          <Button size="small" onClick={() => switchSchool(s.id)}>
                            {t('school.switch')}
                          </Button>
                        )
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </Query>
      <Stack direction="row" sx={{ gap: 1 }}>
        <TextField size="small" label={t('school.newSchoolName')} value={name} onChange={(e) => setName(e.target.value)} />
        <Button
          variant="contained"
          disabled={!name.trim()}
          onClick={async () => (await run(() => add.mutateAsync({ name: name.trim() }), t('common.saved'))) && setName('')}
        >
          {t('school.addSchool')}
        </Button>
      </Stack>
    </Stack>
  );
}

export default function SchoolPage() {
  const { t } = useTranslation();
  const { role } = useAuth();
  const [tab, setTab] = useState(0);
  const q = useGet('/school');
  return (
    <>
      <PageHeader title={t('nav.school')} />
      {can(role, 'org.manage') && (
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={t('school.tabs.school')} />
          <Tab label={t('school.tabs.organization')} />
        </Tabs>
      )}
      {tab === 0 && <Query q={q}>{({ data }) => <SchoolForm school={data} />}</Query>}
      {tab === 1 && <Organization />}
    </>
  );
}
