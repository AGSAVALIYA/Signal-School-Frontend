import { useState } from 'react';
import { Box, Button, Card, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useYear } from '../../app/YearContext';
import { useAuth } from '../../app/AuthContext';
import { EmptyState, Loading, PageHeader, Query } from '../../shared/components/ui';
import SectionSelect, { useSections } from '../../shared/components/SectionSelect';
import { useAction } from '../../shared/hooks/useNotify';
import useDraft from '../../shared/hooks/useDraft';

const TERMS = ['S1', 'S2', 'ANNUAL'];

function Grid({ data, onSave, saving, readOnly, aboveTabs }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  const [rows, setRows] = useDraft(data, (d) => d.rows);
  const [allMax, setAllMax] = useState('');
  const set = (i, k, v) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const num = (v) => (v === '' || v === null ? null : Number(v));
  const tooHigh = (r) => num(r.marks) !== null && num(r.maxMarks) !== null && num(r.marks) > num(r.maxMarks);
  const invalid = rows.some(tooHigh);
  // One input per field; `label` is visible on phones (stacked layout) and the accessible name on tables.
  const input = (r, i, key, { width, numeric, upper } = {}) => (
    <TextField
      size="small"
      label={phone ? t(`marks.${key}`) : undefined}
      type={numeric ? 'number' : 'text'}
      value={r[key] ?? ''}
      error={key === 'marks' && tooHigh(r)}
      helperText={key === 'marks' && tooHigh(r) ? t('fieldErrors.MORE_THAN_MAX') : undefined}
      onChange={(e) => set(i, key, upper ? e.target.value.toUpperCase().slice(0, 5) : e.target.value)}
      disabled={readOnly}
      sx={width ? { width } : undefined}
      slotProps={{ htmlInput: { 'aria-label': `${r.name}: ${t(`marks.${key}`)}`, ...(numeric ? { inputMode: 'decimal', min: 0 } : {}) } }}
    />
  );
  const save = () =>
    onSave(
      rows.map((r) => ({
        enrollmentId: r.enrollmentId,
        grade: r.grade || null,
        marks: num(r.marks),
        maxMarks: num(r.maxMarks),
        remarks: r.remarks || null,
      })),
    );
  return (
    <Card>
      {!readOnly && (
        <Stack direction="row" sx={{ gap: 1, p: 2, alignItems: 'center', flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            size="small"
            type="number"
            label={t('marks.maxForAll')}
            value={allMax}
            onChange={(e) => setAllMax(e.target.value)}
            sx={{ flex: '1 1 200px', maxWidth: 280 }}
            slotProps={{ htmlInput: { inputMode: 'decimal', min: 1 } }}
          />
          <Button disabled={!allMax} onClick={() => setRows((rs) => rs.map((r) => ({ ...r, maxMarks: allMax })))}>
            {t('marks.applyToAll')}
          </Button>
        </Stack>
      )}
      {phone ? (
        // Phones: one block per child, no sideways scrolling.
        <Box>
          {rows.map((r, i) => (
            <Box key={r.enrollmentId} sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'grid', gap: 1.5 }}>
              <Typography sx={{ fontWeight: 600 }}>
                {r.rollNumber ? `${r.rollNumber}. ` : ''}
                {r.name}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {input(r, i, 'grade', { upper: true })}
                {input(r, i, 'marks', { numeric: true })}
                {input(r, i, 'maxMarks', { numeric: true })}
              </Box>
              {input(r, i, 'remarks')}
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>{t('common.name')}</TableCell>
                <TableCell>{t('marks.grade')}</TableCell>
                <TableCell>{t('marks.marks')}</TableCell>
                <TableCell>{t('marks.maxMarks')}</TableCell>
                <TableCell>{t('marks.remarks')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={r.enrollmentId}>
                  <TableCell>{r.rollNumber ?? ''}</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>{r.name}</TableCell>
                  <TableCell>{input(r, i, 'grade', { width: 90, upper: true })}</TableCell>
                  <TableCell>{input(r, i, 'marks', { width: 110, numeric: true })}</TableCell>
                  <TableCell>{input(r, i, 'maxMarks', { width: 110, numeric: true })}</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>{input(r, i, 'remarks')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
      {!readOnly && (
        <Box sx={{ p: 2, position: 'sticky', bottom: { xs: aboveTabs ? 72 : 0, md: 0 }, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" size="large" fullWidth={phone} disabled={saving || invalid} onClick={save}>
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </Box>
      )}
    </Card>
  );
}

export default function MarksPage() {
  const { t } = useTranslation();
  const { sections: all, isLoading: sectionsLoading } = useSections();
  const { readOnly } = useYear();
  const { role } = useAuth();
  // Teachers only see the subjects they teach (the server refuses the rest anyway).
  const mine = useGet(role === 'teacher' ? '/today' : null);
  const mySubjects = role === 'teacher' ? new Set((mine.data?.data.subjects || []).map((s) => s.id)) : null;
  const sections = mySubjects
    ? all.map((s) => ({ ...s, Subjects: (s.Subjects || []).filter((x) => mySubjects.has(x.id)) })).filter((s) => s.Subjects.length)
    : all;
  const [sectionId, setSectionId] = useState(null);
  const [subjectId, setSubjectId] = useState('');
  const [term, setTerm] = useState('S1');
  const run = useAction();
  const section = sections.find((s) => s.id === (sectionId ?? sections[0]?.id));
  const subject = subjectId || section?.Subjects?.[0]?.id || '';
  const q = useGet(subject ? '/marks' : null, { subjectId: subject, term });
  const save = useSend((entries) => api.put('/marks', { subjectId: subject, term, entries }), { invalidate: ['/marks'] });
  return (
    <>
      <PageHeader title={t('nav.marks')} />
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, mb: 2 }}>
        <SectionSelect
          filter={(s) => sections.some((x) => x.id === s.id)}
          value={section?.id ?? ''}
          onChange={(v) => {
            setSectionId(v);
            setSubjectId('');
          }}
        />
        <TextField select label={t('marks.subject')} value={subject} onChange={(e) => setSubjectId(Number(e.target.value))}>
          {(section?.Subjects || []).map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField select label={t('marks.term')} value={term} onChange={(e) => setTerm(e.target.value)}>
          {TERMS.map((x) => (
            <MenuItem key={x} value={x}>
              {t(`marks.terms.${x}`)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      {sectionsLoading || mine.isLoading ? (
        <Loading />
      ) : !subject ? (
        <EmptyState title={t('marks.noSubjects')} />
      ) : (
        <Query q={q}>
          {({ data }) => (
            <Grid
              data={data}
              readOnly={readOnly}
              aboveTabs={role === 'teacher'}
              saving={save.isPending}
              onSave={(entries) => run(() => save.mutateAsync(entries), t('common.saved'))}
            />
          )}
        </Query>
      )}
    </>
  );
}
