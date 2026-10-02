import { useState } from 'react';
import { Box, Button, Card, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useYear } from '../../app/YearContext';
import { EmptyState, PageHeader, Query } from '../../shared/components/ui';
import SectionSelect, { useSections } from '../../shared/components/SectionSelect';
import { useAction } from '../../shared/hooks/useNotify';
import useDraft from '../../shared/hooks/useDraft';

const TERMS = ['S1', 'S2', 'ANNUAL'];

function Grid({ data, onSave, saving, readOnly }) {
  const { t } = useTranslation();
  const [rows, setRows] = useDraft(data, (d) => d.rows);
  const set = (i, k, v) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const num = (v) => (v === '' || v === null ? null : Number(v));
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('common.name')}</TableCell>
              <TableCell sx={{ width: 90 }}>{t('marks.grade')}</TableCell>
              <TableCell sx={{ width: 90 }}>{t('marks.marks')}</TableCell>
              <TableCell sx={{ width: 90 }}>{t('marks.maxMarks')}</TableCell>
              <TableCell>{t('marks.remarks')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={r.enrollmentId}>
                <TableCell>{r.rollNumber ?? ''}</TableCell>
                <TableCell sx={{ minWidth: 160 }}>{r.name}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={r.grade ?? ''}
                    onChange={(e) => set(i, 'grade', e.target.value.toUpperCase().slice(0, 5))}
                    disabled={readOnly}
                    slotProps={{ htmlInput: { 'aria-label': t('marks.grade') } }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={r.marks ?? ''}
                    onChange={(e) => set(i, 'marks', e.target.value)}
                    disabled={readOnly}
                    slotProps={{ htmlInput: { 'aria-label': t('marks.marks') } }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={r.maxMarks ?? ''}
                    onChange={(e) => set(i, 'maxMarks', e.target.value)}
                    disabled={readOnly}
                    slotProps={{ htmlInput: { 'aria-label': t('marks.maxMarks') } }}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  <TextField
                    size="small"
                    value={r.remarks ?? ''}
                    onChange={(e) => set(i, 'remarks', e.target.value)}
                    disabled={readOnly}
                    slotProps={{ htmlInput: { 'aria-label': t('marks.remarks') } }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {!readOnly && (
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            size="large"
            disabled={saving}
            onClick={() =>
              onSave(
                rows.map((r) => ({
                  enrollmentId: r.enrollmentId,
                  grade: r.grade || null,
                  marks: num(r.marks),
                  maxMarks: num(r.maxMarks),
                  remarks: r.remarks || null,
                })),
              )
            }
          >
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </Box>
      )}
    </Card>
  );
}

export default function MarksPage() {
  const { t } = useTranslation();
  const { sections } = useSections();
  const { readOnly } = useYear();
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
          value={section?.id}
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
      {!subject ? (
        <EmptyState title={t('marks.noSubjects')} />
      ) : (
        <Query q={q}>
          {({ data }) => (
            <Grid data={data} readOnly={readOnly} saving={save.isPending} onSave={(entries) => run(() => save.mutateAsync(entries), t('common.saved'))} />
          )}
        </Query>
      )}
    </>
  );
}
