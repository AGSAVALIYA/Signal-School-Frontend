import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert, Box, Button, Card, CardContent, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Download as DownloadIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { PageHeader } from '../../shared/components/ui';
import { useAction, useNotify } from '../../shared/hooks/useNotify';

// Download template → upload → see every row with its problems → import only the good rows.
export default function ImportStudentsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const notify = useNotify();
  const qc = useQueryClient();
  const run = useAction();
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    setBusy(true);
    const res = await run(() => api.post('/students-import/preview', fd));
    setBusy(false);
    if (res) setPreview(res.data);
  };

  const importValid = async () => {
    const rows = preview.rows.filter((r) => !Object.keys(r.errors).length).map(({ data: { className: _c, ...d } }) => d);
    setBusy(true);
    const res = await run(() => api.post('/students-import', { rows }));
    setBusy(false);
    if (res) {
      notify.success(t('import.done', { count: res.data.created }));
      qc.invalidateQueries();
      navigate('/students');
    }
  };

  return (
    <>
      <PageHeader title={t('import.title')} back="/students" help={t('help.import')} />
      <Stack sx={{ gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              {t('import.step1')}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 2 }}>{t('import.step1Text')}</Typography>
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              onClick={() => run(() => api.download('/students-import/template', undefined, 'students-template.xlsx'))}
            >
              {t('import.downloadTemplate')}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              {t('import.step2')}
            </Typography>
            <Button component="label" startIcon={<UploadFileIcon />} variant="contained" disabled={busy}>
              {t('import.chooseFile')}
              <input hidden type="file" accept=".xlsx,.csv" onChange={(e) => e.target.files[0] && upload(e.target.files[0])} />
            </Button>
          </CardContent>
        </Card>
        {preview && (
          <Card>
            <CardContent>
              <Alert severity={preview.valid === preview.total ? 'success' : 'warning'} sx={{ mb: 2 }}>
                {t('import.summary', { valid: preview.valid, total: preview.total })}
              </Alert>
              <Box sx={{ overflowX: 'auto' }} tabIndex={0} role="region" aria-label={t('import.title')}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('import.row')}</TableCell>
                      <TableCell>{t('students.fields.name')}</TableCell>
                      <TableCell>{t('students.fields.class')}</TableCell>
                      <TableCell>{t('import.problems')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {preview.rows.map((r) => (
                      <TableRow key={r.row} sx={{ bgcolor: Object.keys(r.errors).length ? 'error.50' : undefined }}>
                        <TableCell>{r.row}</TableCell>
                        <TableCell>{r.data.name}</TableCell>
                        <TableCell>{r.data.className}</TableCell>
                        <TableCell>
                          {Object.keys(r.errors).length ? (
                            <Stack direction="row" sx={{ gap: 0.5, flexWrap: 'wrap' }}>
                              {Object.entries(r.errors).map(([k, code]) => (
                                <Chip key={k} size="small" color="error" label={`${k}: ${t(`fieldErrors.${code}`, { defaultValue: code })}`} />
                              ))}
                            </Stack>
                          ) : (
                            <Chip size="small" color="success" label={t('import.ok')} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Button sx={{ mt: 2 }} variant="contained" size="large" disabled={!preview.valid || busy} onClick={importValid}>
                {t('import.importValid', { count: preview.valid })}
              </Button>
            </CardContent>
          </Card>
        )}
      </Stack>
    </>
  );
}
