import { useState } from 'react';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PhotoField } from '../../shared/components/PhotoPicker';
import { todayISO } from '../../shared/utils/format';

// Shared note form for a whole class or one student: date, text, subjects, one photo.
export default function NoteDialog({ title, subjects = [], onSubmit, onClose }) {
  const { t } = useTranslation();
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');
  const [picked, setPicked] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const fd = new FormData();
    fd.append('note', note);
    fd.append('subjectIds', JSON.stringify(picked.map((s) => s.id)));
    if (photo) fd.append('photo', photo, 'photo.jpg');
    setBusy(true);
    const ok = await onSubmit(date, fd);
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ pt: 1 }}>
          <TextField
            type="date"
            label={t('common.date')}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            inputProps={{ max: todayISO() }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField label={t('diary.notePlaceholder')} value={note} onChange={(e) => setNote(e.target.value)} multiline minRows={3} autoFocus />
          {subjects.length > 0 && (
            <Autocomplete
              multiple
              options={subjects}
              getOptionLabel={(o) => o.name}
              value={picked}
              onChange={(_, v) => setPicked(v)}
              renderInput={(p) => <TextField {...p} label={t('diary.subjects')} />}
            />
          )}
          <PhotoField file={photo} onChange={setPhoto} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="contained" onClick={submit} disabled={busy || (!note && !photo)}>
          {busy ? t('common.saving') : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
