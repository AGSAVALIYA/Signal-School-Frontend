import { useCallback, useId, useState } from 'react';
import { Avatar, Badge, Box, Button, CircularProgress, IconButton } from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import imageCompression from 'browser-image-compression';
import { useTranslation } from 'react-i18next';
import { initials } from '../utils/format';

// Compresses on the phone before upload (≈200 KB), so photos upload fast on slow networks.
export const compressImage = (file) =>
  imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 1280, useWebWorker: true, fileType: 'image/jpeg' }).catch(() => file);

export function PhotoInput({ onFile, children }) {
  const id = useId();
  const open = useCallback(() => document.getElementById(id)?.click(), [id]);
  return (
    <>
      <input
        id={id}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={async (e) => e.target.files[0] && onFile(await compressImage(e.target.files[0]))}
      />
      {children(open)}
    </>
  );
}

// Avatar with a camera button that uploads immediately via onUpload(file).
export default function PhotoPicker({ url, name, onUpload, size = 96, disabled }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const upload = async (file) => {
    setBusy(true);
    try {
      await onUpload(file);
    } finally {
      setBusy(false);
    }
  };
  return (
    <PhotoInput onFile={upload}>
      {(open) => (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            !disabled && (
              <IconButton
                size="small"
                aria-label={t('common.changePhoto')}
                onClick={open}
                sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                {busy ? <CircularProgress size={18} color="inherit" /> : <PhotoCameraIcon fontSize="small" />}
              </IconButton>
            )
          }
        >
          <Avatar src={url || undefined} alt={name} sx={{ width: size, height: size, fontSize: size / 3 }}>
            {initials(name)}
          </Avatar>
        </Badge>
      )}
    </PhotoInput>
  );
}

export function PhotoField({ file, onChange }) {
  const { t } = useTranslation();
  return (
    <PhotoInput onFile={onChange}>
      {(open) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={open}>
            {file ? t('common.changePhoto') : t('common.addPhoto')}
          </Button>
          {file && <Box component="img" src={URL.createObjectURL(file)} alt="" sx={{ height: 64, borderRadius: 1 }} />}
          {file && <Button onClick={() => onChange(null)}>{t('common.removePhoto')}</Button>}
        </Box>
      )}
    </PhotoInput>
  );
}
