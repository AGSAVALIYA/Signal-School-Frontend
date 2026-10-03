import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useGet } from '../../api/hooks';
import { useYear } from '../../app/YearContext';
import { PageHeader } from '../../shared/components/ui';
import { useAction } from '../../shared/hooks/useNotify';

const STEPS = ['details', 'classes', 'copy', 'promotion', 'review'];
const ACTIONS = ['promote', 'detain', 'leave', 'graduate'];
const REASONS = ['migrated', 'dropped_out', 'transferred', 'tc_issued', 'other'];

// Next year name/dates from the current year: "2025-26" → "2026-27".
function suggest(year) {
  const shift = (d) => dayjs(d).add(1, 'year').format('YYYY-MM-DD');
  const name = year.name.replace(/(\d{4})(\D+)(\d{2,4})/, (_, a, sep, b) => `${Number(a) + 1}${sep}${String(Number(b) + 1).padStart(b.length, '0')}`);
  return { name: name === year.name ? `${year.name} +1` : name, startDate: shift(year.startDate), endDate: shift(year.endDate) };
}

function Details({ form, setForm, years }) {
  const { t } = useTranslation();
  return (
    <Stack sx={{ gap: 2, maxWidth: 480 }}>
      <TextField select label={t('rollover.sourceYear')} value={form.sourceYearId} onChange={(e) => setForm({ ...form, sourceYearId: Number(e.target.value) })}>
        {years.map((y) => (
          <MenuItem key={y.id} value={y.id}>
            {y.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField label={t('years.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
  );
}

function Classes({ plan, setPlan, grades }) {
  const { t } = useTranslation();
  const [gradeId, setGradeId] = useState('');
  const [name, setName] = useState('');
  const setSection = (i, patch) => setPlan({ ...plan, sections: plan.sections.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography sx={{ color: 'text.secondary' }}>{t('rollover.classesHelp')}</Typography>
      {plan.sections.map((s, i) => (
        <Stack key={s.key} direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          <Checkbox checked={s.include} onChange={(e) => setSection(i, { include: e.target.checked })} slotProps={{ input: { 'aria-label': s.name } }} />
          <TextField size="small" value={s.name} onChange={(e) => setSection(i, { name: e.target.value })} disabled={!s.include} />
          <Typography sx={{ color: 'text.secondary', minWidth: 90 }}>{grades.find((g) => g.id === s.gradeId)?.name}</Typography>
        </Stack>
      ))}
      <Stack direction="row" sx={{ gap: 1 }}>
        <TextField select size="small" label={t('classes.grade')} value={gradeId} onChange={(e) => setGradeId(e.target.value)} sx={{ minWidth: 150 }}>
          {grades.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField size="small" label={t('classes.sectionName')} value={name} onChange={(e) => setName(e.target.value)} />
        <Button
          disabled={!gradeId || !name.trim()}
          onClick={() => {
            setPlan({ ...plan, sections: [...plan.sections, { key: `new-${Date.now()}`, sourceId: null, gradeId, name: name.trim(), include: true }] });
            setName('');
          }}
        >
          {t('common.add')}
        </Button>
      </Stack>
    </Stack>
  );
}

function Copy({ plan, setPlan }) {
  const { t } = useTranslation();
  const set = (k, v) => setPlan({ ...plan, copy: { ...plan.copy, [k]: v, ...(k === 'subjects' && !v ? { syllabus: false } : {}) } });
  return (
    <Stack sx={{ gap: 1 }}>
      <FormControlLabel
        control={<Switch checked={plan.copy.subjects} onChange={(e) => set('subjects', e.target.checked)} />}
        label={t('rollover.copySubjects')}
      />
      <FormControlLabel
        control={<Switch checked={plan.copy.syllabus} disabled={!plan.copy.subjects} onChange={(e) => set('syllabus', e.target.checked)} />}
        label={t('rollover.copySyllabus')}
      />
      <FormControlLabel
        control={<Switch checked={plan.copy.assignments} onChange={(e) => set('assignments', e.target.checked)} />}
        label={t('rollover.copyAssignments')}
      />
      <Alert severity="info">{t('rollover.copyNote')}</Alert>
    </Stack>
  );
}

// One child's decision. Memoised: a school can have 1,000+ children, and a change must not re-render every dropdown.
const PromotionRow = memo(function PromotionRow({ p, i, targets, onSet }) {
  const { t } = useTranslation();
  return (
    <TableRow>
      <TableCell sx={{ minWidth: 160 }}>{p.studentName}</TableCell>
      <TableCell>
        <TextField
          select
          size="small"
          value={p.action}
          onChange={(e) => onSet([i], { action: e.target.value })}
          slotProps={{ htmlInput: { 'aria-label': t('rollover.action') } }}
        >
          {ACTIONS.map((a) => (
            <MenuItem key={a} value={a}>
              {t(`rollover.actions.${a}`)}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>
      <TableCell sx={{ minWidth: 180 }}>
        {['promote', 'detain'].includes(p.action) ? (
          <TextField
            select
            size="small"
            value={targets.some((s) => s.key === p.targetKey) ? p.targetKey : ''}
            error={!targets.some((s) => s.key === p.targetKey)}
            onChange={(e) => onSet([i], { targetKey: e.target.value })}
            slotProps={{ htmlInput: { 'aria-label': t('rollover.target') } }}
          >
            {targets.map((s) => (
              <MenuItem key={s.key} value={s.key}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
        ) : p.action === 'leave' ? (
          <TextField
            select
            size="small"
            value={p.reason || 'migrated'}
            onChange={(e) => onSet([i], { reason: e.target.value })}
            slotProps={{ htmlInput: { 'aria-label': t('students.leaveReason') } }}
          >
            {REASONS.map((r) => (
              <MenuItem key={r} value={r}>
                {t(`students.reasons.${r}`)}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          '–'
        )}
      </TableCell>
    </TableRow>
  );
});

// One class in the promotion step. Re-renders only when one of its children's decisions changed.
const sameRows = (a, b) =>
  a.name === b.name && a.targets === b.targets && a.onSet === b.onSet && a.rows.length === b.rows.length && a.rows.every((r, k) => r === b.rows[k]);
const ClassCard = memo(function ClassCard({ name, items, rows, targets, onSet }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
          <Typography variant="h3" sx={{ flex: 1 }}>
            {name} · {t('classes.studentCount', { count: items.length })}
          </Typography>
          <TextField
            select
            size="small"
            label={t('rollover.applyToAll')}
            value=""
            onChange={(e) => onSet(items, { action: e.target.value })}
            sx={{ minWidth: 180 }}
            fullWidth={false}
          >
            {ACTIONS.map((a) => (
              <MenuItem key={a} value={a}>
                {t(`rollover.actions.${a}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('rollover.moveAllTo')}
            value=""
            onChange={(e) =>
              onSet(
                items.filter((_, k) => rows[k].action === 'promote'),
                { targetKey: e.target.value },
              )
            }
            sx={{ minWidth: 180 }}
            fullWidth={false}
          >
            {targets.map((s) => (
              <MenuItem key={s.key} value={s.key}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('common.name')}</TableCell>
                <TableCell>{t('rollover.action')}</TableCell>
                <TableCell>{t('rollover.target')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((i, k) => (
                <PromotionRow key={rows[k].enrollmentId} p={rows[k]} i={i} targets={targets} onSet={onSet} />
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}, sameRows);

function Promotion({ plan, setPlan }) {
  const { t } = useTranslation();
  const targets = useMemo(() => plan.sections.filter((s) => s.include), [plan.sections]);
  const groups = useMemo(() => {
    const map = new Map();
    plan.promotions.forEach((p, i) => {
      if (!map.has(p.fromSectionId)) map.set(p.fromSectionId, { name: p.fromSectionName, items: [] });
      map.get(p.fromSectionId).items.push(i);
    });
    return [...map.entries()];
  }, [plan.promotions]);
  const setP = useCallback(
    (indexes, patch) => {
      const pick = new Set(indexes);
      setPlan((prev) => ({
        ...prev,
        promotions: prev.promotions.map((p, i) => {
          if (!pick.has(i)) return p;
          const next = { ...p, ...patch };
          if (patch.action === 'detain') next.targetKey = `src-${p.fromSectionId}`;
          if (patch.action === 'leave' || patch.action === 'graduate') next.targetKey = null;
          if (patch.action === 'leave' && !next.reason) next.reason = 'migrated';
          return next;
        }),
      }));
    },
    [setPlan],
  );
  const missing = plan.promotions.filter((p) => ['promote', 'detain'].includes(p.action) && !targets.some((s) => s.key === p.targetKey)).length;

  return (
    <Stack sx={{ gap: 3 }}>
      <Typography sx={{ color: 'text.secondary' }}>{t('rollover.promotionHelp')}</Typography>
      {missing > 0 && <Alert severity="warning">{t('rollover.missingTargets', { count: missing })}</Alert>}
      {groups.map(([sectionId, g]) => (
        <ClassCard key={sectionId} name={g.name} items={g.items} rows={g.items.map((i) => plan.promotions[i])} targets={targets} onSet={setP} />
      ))}
    </Stack>
  );
}

function Review({ plan, setPlan }) {
  const { t } = useTranslation();
  const count = (a) => plan.promotions.filter((p) => p.action === a).length;
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h3">
        {plan.name} · {dayjs(plan.startDate).format('DD MMM YYYY')} – {dayjs(plan.endDate).format('DD MMM YYYY')}
      </Typography>
      <Typography>{t('rollover.reviewSections', { count: plan.sections.filter((s) => s.include).length })}</Typography>
      <Typography>
        {t('rollover.reviewCopy', {
          subjects: t(plan.copy.subjects ? 'common.yes' : 'common.no'),
          syllabus: t(plan.copy.syllabus ? 'common.yes' : 'common.no'),
          teachers: t(plan.copy.assignments ? 'common.yes' : 'common.no'),
        })}
      </Typography>
      <Typography>
        {t('rollover.reviewPromotions', { promote: count('promote'), detain: count('detain'), leave: count('leave'), graduate: count('graduate') })}
      </Typography>
      <FormControlLabel
        control={<Switch checked={plan.activate} onChange={(e) => setPlan({ ...plan, activate: e.target.checked })} />}
        label={t('rollover.activateNow')}
      />
      <Alert severity="info">{plan.activate ? t('rollover.activateNowText') : t('rollover.activateLaterText')}</Alert>
    </Stack>
  );
}

export default function RolloverWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const run = useAction();
  const { years, current, refetch } = useYear();
  const grades = useGet('/grades');
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() =>
    current ? { sourceYearId: current.id, ...suggest(current) } : { sourceYearId: '', name: '', startDate: '', endDate: '' },
  );
  const [plan, setPlan] = useState(null);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState(null);
  const [key] = useState(() => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`));

  const targets = plan?.sections.filter((s) => s.include) || [];
  const missing = plan?.promotions.filter((p) => ['promote', 'detain'].includes(p.action) && !targets.some((s) => s.key === p.targetKey)).length;
  const canNext = [form.sourceYearId && form.name && form.startDate < form.endDate, targets.length > 0, true, !missing, true][step];

  const next = async () => {
    if (step === 0) {
      setBusy(true);
      const r = await run(() => api.post('/academic-years/rollover/preview', form));
      setBusy(false);
      if (!r) return;
      setPlan({ ...r.data, ...form });
    }
    if (step === STEPS.length - 1) {
      setBusy(true);
      const promotions = plan.promotions.map(({ enrollmentId, action, targetKey, reason }) => ({
        enrollmentId,
        action,
        targetKey: targetKey || null,
        reason: reason || null,
      }));
      const r = await run(() => api.post('/academic-years/rollover', { idempotencyKey: key, plan: { ...plan, promotions } }));
      setBusy(false);
      if (r) {
        setSummary(r.data);
        refetch();
        qc.invalidateQueries();
      }
      return;
    }
    setStep((s) => s + 1);
  };

  if (summary)
    return (
      <Box sx={{ maxWidth: 640 }}>
        <PageHeader title={t('rollover.doneTitle', { name: summary.name })} />
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('rollover.doneText', {
            sections: summary.sections,
            subjects: summary.subjects,
            topics: summary.topics,
            assignments: summary.assignments,
            promoted: summary.promotions.promote,
            detained: summary.promotions.detain,
          })}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/years')}>
          {t('rollover.backToYears')}
        </Button>
      </Box>
    );

  return (
    <>
      <PageHeader back="/years" title={t('years.startNew')} help={t('help.rollover')} />
      <Stepper activeStep={step} alternativeLabel sx={{ mb: 3, overflowX: 'auto' }}>
        {STEPS.map((s) => (
          <Step key={s}>
            <StepLabel>{t(`rollover.steps.${s}`)}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {step === 0 && <Details form={form} setForm={setForm} years={years} />}
      {step === 1 && plan && <Classes plan={plan} setPlan={setPlan} grades={grades.data?.data || []} />}
      {step === 2 && plan && <Copy plan={plan} setPlan={setPlan} />}
      {step === 3 && plan && <Promotion plan={plan} setPlan={setPlan} />}
      {step === 4 && plan && <Review plan={plan} setPlan={setPlan} />}
      <Stack direction="row" sx={{ gap: 1, mt: 3, position: 'sticky', bottom: 16 }}>
        {step > 0 && <Button onClick={() => setStep((s) => s - 1)}>{t('common.back')}</Button>}
        <Button variant="contained" size="large" disabled={!canNext || busy} onClick={next} sx={{ boxShadow: 3 }}>
          {busy ? t('common.saving') : step === STEPS.length - 1 ? t('rollover.create') : t('common.next')}
        </Button>
      </Stack>
    </>
  );
}
