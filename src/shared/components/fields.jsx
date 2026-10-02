import { Controller } from 'react-hook-form';
import { Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

// TextField bound to react-hook-form; error codes (client or server) are translated.
export function Field({ control, name, label, select, options = [], type = 'text', required, slotProps, ...rest }) {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value ?? ''}
          onChange={(e) => field.onChange(type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)}
          label={required ? `${label} *` : label}
          type={type}
          select={select}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error ? t(`fieldErrors.${fieldState.error.message}`, { defaultValue: t('fieldErrors.INVALID') }) : rest.helperText}
          {...rest}
          slotProps={{ ...slotProps, inputLabel: type === 'date' ? { shrink: true, ...slotProps?.inputLabel } : slotProps?.inputLabel }}
        >
          {select &&
            options.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
}

// Copies server field errors ({ field: CODE }) onto a react-hook-form instance.
export function applyServerErrors(err, setError) {
  Object.entries(err?.fields || {}).forEach(([field, code]) => setError(field, { message: code }));
}

// Checkbox bound to react-hook-form.
export function CheckField({ control, name, label }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControlLabel control={<Checkbox checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} />} label={label} />
      )}
    />
  );
}
