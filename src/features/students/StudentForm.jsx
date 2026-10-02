import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CheckField, Field, applyServerErrors } from '../../shared/components/fields';
import { useSections } from '../../shared/components/SectionSelect';
import { useNotify } from '../../shared/hooks/useNotify';

const phone = z
  .string()
  .regex(/^\+?[\d\s-]{8,16}$/, 'PHONE')
  .or(z.literal(''))
  .nullish();
const schema = z.object({
  name: z.string().trim().min(1, 'REQUIRED'),
  classSectionId: z.number({ error: 'REQUIRED' }),
  gender: z.string().nullish(),
  dob: z.string().nullish(),
  dobUnknown: z.boolean(),
  approxAge: z.number().min(1, 'INVALID').max(30, 'INVALID').nullish(),
  guardianName: z.string().nullish(),
  guardianRelation: z.string().nullish(),
  guardianPhone: phone,
  guardianPhone2: phone,
  fatherName: z.string().nullish(),
  motherName: z.string().nullish(),
  address: z.string().nullish(),
  bloodGroup: z.string().max(5).nullish(),
  aadhaarLast4: z
    .string()
    .regex(/^\d{4}$/, 'AADHAAR4')
    .or(z.literal(''))
    .nullish(),
  grNumber: z.string().nullish(),
  rollNumber: z.number().int().min(1, 'INVALID').nullish(),
  admissionDate: z.string().nullish(),
  consentPhoto: z.boolean(),
});

const toForm = (s, sectionId) => ({
  name: s?.name ?? '',
  classSectionId: s?.enrollment?.classSectionId ?? sectionId ?? null,
  gender: s?.gender ?? '',
  dob: s?.dob ?? '',
  dobUnknown: Boolean(s && !s.dob && s.estimatedBirthYear),
  approxAge: s?.estimatedBirthYear ? new Date().getFullYear() - s.estimatedBirthYear : null,
  guardianName: s?.guardianName ?? '',
  guardianRelation: s?.guardianRelation ?? '',
  guardianPhone: s?.guardianPhone ?? '',
  guardianPhone2: s?.guardianPhone2 ?? '',
  fatherName: s?.fatherName ?? '',
  motherName: s?.motherName ?? '',
  address: s?.address ?? '',
  bloodGroup: s?.bloodGroup ?? '',
  aadhaarLast4: s?.aadhaarLast4 ?? '',
  grNumber: s?.grNumber ?? '',
  rollNumber: s?.enrollment?.rollNumber ?? null,
  admissionDate: s?.admissionDate ?? '',
  consentPhoto: s?.consentPhoto ?? false,
});

const blankToNull = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v === '' ? null : v]));

// One form for teachers, clerks and admins: essentials first, everything else under "More details".
export default function StudentForm({ student, sectionId, onSubmit, onClose }) {
  const { t } = useTranslation();
  const notify = useNotify();
  const { sections } = useSections();
  const [more, setMore] = useState(Boolean(student));
  const { control, handleSubmit, setError, formState } = useForm({ resolver: zodResolver(schema), defaultValues: toForm(student, sectionId) });
  const dobUnknown = useWatch({ control, name: 'dobUnknown' });

  const submit = handleSubmit(async ({ dobUnknown: unknown, approxAge, ...values }) => {
    const body = blankToNull({
      ...values,
      dob: unknown ? null : values.dob,
      dobIsApproximate: unknown,
      estimatedBirthYear: unknown && approxAge ? new Date().getFullYear() - approxAge : null,
    });
    if (student && !body.grNumber) delete body.grNumber;
    try {
      await onSubmit(body);
      onClose();
    } catch (err) {
      applyServerErrors(err, setError);
      notify.error(err);
    }
  });

  const g = (name, label, props = {}) => (
    <Grid size={{ xs: 12, sm: props.half === false ? 12 : 6 }}>
      <Field control={control} name={name} label={label} {...props} />
    </Grid>
  );

  return (
    <Dialog open onClose={onClose} maxWidth="md">
      <DialogTitle>{student ? t('students.edit') : t('students.add')}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} component="form" id="student-form" onSubmit={submit}>
          {g('name', t('students.fields.name'), { required: true, autoFocus: true })}
          {g('classSectionId', t('students.fields.class'), {
            required: true,
            select: true,
            options: sections.map((s) => ({ value: s.id, label: s.name })),
            type: 'number',
          })}
          {g('gender', t('students.fields.gender'), { select: true, options: ['F', 'M', 'O'].map((v) => ({ value: v, label: t(`students.gender.${v}`) })) })}
          {dobUnknown ? g('approxAge', t('students.fields.approxAge'), { type: 'number' }) : g('dob', t('students.fields.dob'), { type: 'date' })}
          <Grid size={{ xs: 12 }} sx={{ mt: -1 }}>
            <CheckField control={control} name="dobUnknown" label={t('students.fields.dobUnknown')} />
          </Grid>
          {g('guardianName', t('students.fields.guardianName'))}
          {g('guardianPhone', t('students.fields.guardianPhone'), { type: 'tel', slotProps: { htmlInput: { inputMode: 'tel' } } })}
          <Grid size={{ xs: 12 }}>
            <Button onClick={() => setMore((m) => !m)} endIcon={<ExpandMoreIcon sx={{ transform: more ? 'rotate(180deg)' : 'none' }} />}>
              {t('students.moreDetails')}
            </Button>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Collapse in={more}>
              <Grid container spacing={2}>
                {g('guardianRelation', t('students.fields.guardianRelation'))}
                {g('guardianPhone2', t('students.fields.guardianPhone2'), { type: 'tel' })}
                {g('fatherName', t('students.fields.fatherName'))}
                {g('motherName', t('students.fields.motherName'))}
                {g('address', t('students.fields.address'), { half: false, multiline: true, minRows: 2 })}
                {g('rollNumber', t('students.fields.rollNumber'), { type: 'number' })}
                {g('grNumber', t('students.fields.grNumber'), { helperText: student ? undefined : t('students.grAuto') })}
                {g('admissionDate', t('students.fields.admissionDate'), { type: 'date' })}
                {g('bloodGroup', t('students.fields.bloodGroup'))}
                {g('aadhaarLast4', t('students.fields.aadhaarLast4'), { slotProps: { htmlInput: { inputMode: 'numeric', maxLength: 4 } } })}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CheckField control={control} name="consentPhoto" label={t('students.fields.consentPhoto')} />
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button type="submit" form="student-form" variant="contained" size="large" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? t('common.saving') : t('students.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
