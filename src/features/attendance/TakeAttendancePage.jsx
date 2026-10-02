import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { Alert, Avatar, Box, Button, Chip, InputAdornment, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Save as SaveIcon, Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useGet } from '../../api/hooks';
import { api } from '../../api/client';
import { session } from '../../api/session';
import { PageHeader, Query } from '../../shared/components/ui';
import { useNotify } from '../../shared/hooks/useNotify';
import { fmtTime, initials, todayISO } from '../../shared/utils/format';
import { enqueue } from './offlineQueue';
import useDraft from '../../shared/hooks/useDraft';

const TONE = { P: 'success', A: 'error', L: 'warning', LATE: 'info' };
const CHOICES = ['P', 'A', 'L'];

// One row per child: every status is one tap away (no hidden "tap to cycle").
function Row({ row, status, onChange, disabled }) {
  const { t } = useTranslation();
  const choices = status === 'LATE' ? [...CHOICES, 'LATE'] : CHOICES;
  return (
    <Box
      sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, alignItems: 'center', px: { xs: 1, sm: 1.5 }, py: 1, borderBottom: 1, borderColor: 'divider', minHeight: 64 }}
    >
      <Typography sx={{ width: 24, flexShrink: 0, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{row.rollNumber ?? ''}</Typography>
      <Avatar src={row.photoUrl || undefined} alt="" sx={{ width: 36, height: 36, fontSize: '0.9rem', display: { xs: 'none', sm: 'flex' } }}>
        {initials(row.name)}
      </Avatar>
      <Typography id={`name-${row.studentId}`} sx={{ flex: 1, minWidth: 0, fontSize: '1.05rem', overflowWrap: 'anywhere' }}>
        {row.name}
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={status}
        disabled={disabled}
        onChange={(_, v) => v && onChange(v)}
        aria-labelledby={`name-${row.studentId}`}
        sx={{ flexShrink: 0 }}
      >
        {choices.map((c) => (
          <ToggleButton
            key={c}
            value={c}
            aria-label={`${row.name}: ${t(`attendance.status.${c}`)}`}
            sx={{
              minWidth: { xs: 44, md: 88 },
              minHeight: 44,
              px: 1,
              fontWeight: 700,
              fontSize: '1rem',
              '&.Mui-selected, &.Mui-selected:hover': { bgcolor: `${TONE[c]}.main`, color: `${TONE[c]}.contrastText` },
            }}
          >
            {t(`attendance.short.${c}`)}
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, ml: 0.5, fontWeight: 600 }}>
              {t(`attendance.status.${c}`)}
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}

function Sheet({ sheet, sectionId, date }) {
  const { t } = useTranslation();
  const notify = useNotify();
  const qc = useQueryClient();
  // Everyone starts Present; saved statuses win.
  const [marks, setMarks] = useDraft(sheet, (s) => Object.fromEntries(s.rows.map((r) => [r.studentId, r.status || 'P'])));
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useDraft(sheet, (s) => s.session?.submittedAt || null);
  const [queued, setQueued] = useState(false);

  const counts = useMemo(() => {
    const c = { P: 0, A: 0, L: 0, LATE: 0 };
    Object.values(marks).forEach((s) => (c[s] += 1));
    return c;
  }, [marks]);
  const rows = sheet.rows.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()));
  const dirty = sheet.editable && sheet.rows.some((r) => r.status !== marks[r.studentId]);
  useEffect(() => {
    if (!dirty) return undefined;
    // Closing or reloading the tab with unsaved marks asks first.
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const save = async () => {
    const payload = { rows: sheet.rows.map((r) => ({ studentId: r.studentId, status: marks[r.studentId] })), clientMarkedAt: new Date().toISOString() };
    setSaving(true);
    try {
      const { data } = await api.put(`/attendance/sections/${sectionId}/${date}`, payload);
      qc.setQueryData([`/attendance/sections/${sectionId}/${date}`, null, session.get().schoolId ?? null, session.get().yearId ?? null], { data });
      qc.invalidateQueries({ predicate: (q) => ['/today', '/attendance/today', '/dashboard'].includes(q.queryKey[0]) });
      setSavedAt(data.session?.submittedAt);
      setQueued(false);
      notify.success(t('attendance.savedSummary', { present: counts.P + counts.LATE, absent: counts.A }));
      navigator.vibrate?.(80);
    } catch (err) {
      if (err.code === 'NETWORK') {
        await enqueue({ sectionId, sectionName: sheet.section.name, date, schoolId: session.get().schoolId, ...payload });
        setQueued(true);
      } else notify.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack sx={{ gap: 2 }}>
      {sheet.holiday && (
        <Alert severity="info">{sheet.holiday.type === 'weekly_off' ? t('today.weeklyOff') : t('today.holiday', { name: sheet.holiday.name })}</Alert>
      )}
      {!sheet.editable && <Alert severity="warning">{t(`errors.${sheet.lockReason}`)}</Alert>}
      {queued && <Alert severity="warning">{t('attendance.offlineQueued')}</Alert>}
      {savedAt && !dirty && !queued && <Alert severity="success">{t('attendance.savedAt', { time: fmtTime(savedAt) })}</Alert>}
      {dirty && savedAt && !queued && <Alert severity="info">{t('attendance.unsaved')}</Alert>}
      {!savedAt && sheet.editable && <Alert severity="info">{t('help.attendance')}</Alert>}

      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }} aria-live="polite">
        {['P', 'A', 'L'].map((c) => (
          <Chip key={c} color={TONE[c]} variant={counts[c] ? 'filled' : 'outlined'} label={`${t(`attendance.status.${c}`)}: ${counts[c] + (c === 'P' ? counts.LATE : 0)}`} />
        ))}
        <Box sx={{ flex: 1 }} />
        {sheet.editable && (
          <Button
            variant="outlined"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            onClick={() => setMarks(Object.fromEntries(sheet.rows.map((r) => [r.studentId, 'P'])))}
          >
            {t('attendance.allPresent')}
          </Button>
        )}
      </Stack>
      <TextField
        placeholder={t('common.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      <Paper variant="outlined">
        {rows.length ? (
          rows.map((r) => (
            <Row
              key={r.studentId}
              row={r}
              status={marks[r.studentId] || 'P'}
              disabled={!sheet.editable}
              onChange={(v) => setMarks((m) => ({ ...m, [r.studentId]: v }))}
            />
          ))
        ) : (
          <Typography sx={{ color: 'text.secondary', p: 3 }}>{t('attendance.noStudents')}</Typography>
        )}
      </Paper>
      {sheet.editable && sheet.rows.length > 0 && (
        <Box sx={{ position: 'sticky', bottom: { xs: 72, md: 16 }, zIndex: 5 }}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={save}
            disabled={saving}
            sx={{ minHeight: 56, fontSize: '1.1rem', boxShadow: 3 }}
          >
            {saving ? t('common.saving') : t('attendance.save')}
          </Button>
        </Box>
      )}
    </Stack>
  );
}

export default function TakeAttendancePage() {
  const { t } = useTranslation();
  const { sectionId } = useParams();
  const [params, setParams] = useSearchParams();
  const date = params.get('date') || todayISO();
  const q = useGet(`/attendance/sections/${sectionId}/${date}`);
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <PageHeader title={q.data ? t('attendance.title', { name: q.data.data.section.name }) : t('nav.attendance')} back />
      <TextField
        type="date"
        label={t('common.date')}
        value={date}
        onChange={(e) => e.target.value && setParams({ date: e.target.value })}
        sx={{ mb: 2, maxWidth: 220 }}
        slotProps={{ htmlInput: { max: todayISO() }, inputLabel: { shrink: true } }}
      />
      <Query q={q}>{({ data }) => <Sheet sheet={data} sectionId={sectionId} date={date} />}</Query>
    </Box>
  );
}
