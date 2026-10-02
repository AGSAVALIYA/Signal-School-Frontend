import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';

export const useSections = () => {
  const q = useGet('/sections', undefined, { staleTime: 60000 });
  return { ...q, sections: q.data?.data ?? [] };
};

export default function SectionSelect({ value, onChange, label, allowAll, filter, ...rest }) {
  const { t } = useTranslation();
  const { sections: all } = useSections();
  const sections = filter ? all.filter(filter) : all;
  return (
    <TextField
      select
      label={label || t('students.fields.class')}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      {...rest}
    >
      {allowAll && <MenuItem value="">{t('common.all')}</MenuItem>}
      {sections.map((s) => (
        <MenuItem key={s.id} value={s.id}>
          {s.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
