import { useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Dialog, IconButton, Stack, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { isStaff } from '../../shared/utils/permissions';
import { EmptyState, Query, StatusChip } from '../../shared/components/ui';
import { useAction } from '../../shared/hooks/useNotify';
import { useConfirm } from '../../shared/hooks/useConfirm';
import { fmtDate } from '../../shared/utils/format';
import NoteDialog from './NoteDialog';

export default function DiaryList({ studentId, canWrite }) {
  const { t } = useTranslation();
  const { me, role } = useAuth();
  const run = useAction();
  const confirm = useConfirm();
  const [adding, setAdding] = useState(false);
  const [photo, setPhoto] = useState(null);
  const q = useGet(`/diary/students/${studentId}`);
  const save = useSend(({ date, fd }) => api.put(`/diary/students/${studentId}/${date}`, fd), { invalidate: ['/diary'] });
  const remove = useSend(({ kind, id }) => api.delete(`/diary/entries/${kind}/${id}`), { invalidate: ['/diary'] });

  return (
    <Stack gap={2}>
      {canWrite && (
        <Button startIcon={<AddIcon />} variant="outlined" onClick={() => setAdding(true)} sx={{ alignSelf: 'flex-start' }}>
          {t('diary.addStudentNote')}
        </Button>
      )}
      <Query q={q}>
        {({ data }) =>
          data.length ? (
            data.map((e) => (
              <Card key={`${e.kind}-${e.id}`}>
                <CardContent>
                  <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography fontWeight={700}>{fmtDate(e.date)}</Typography>
                    {e.kind === 'class' && <Chip size="small" label={t('diary.classLabel')} />}
                    {e.attendance && <StatusChip status={e.attendance} />}
                    <Box sx={{ flex: 1 }} />
                    {(e.createdBy === me.id || isStaff(role)) && (
                      <IconButton
                        aria-label={t('common.delete')}
                        onClick={async () =>
                          (await confirm({ title: t('diary.deleteConfirm'), danger: true, confirmLabel: t('common.delete') })) &&
                          run(() => remove.mutateAsync(e))
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                  {e.note && <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>{e.note}</Typography>}
                  {e.photoUrl && (
                    <Box
                      component="img"
                      src={e.photoUrl}
                      alt=""
                      onClick={() => setPhoto(e.photoUrl)}
                      sx={{ mt: 1, maxHeight: 160, maxWidth: '100%', borderRadius: 1, cursor: 'zoom-in' }}
                    />
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {[e.subjects?.join(', '), e.author && t('diary.byAuthor', { name: e.author })].filter(Boolean).join(' · ')}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState title={t('diary.empty')} />
          )
        }
      </Query>
      {adding && (
        <NoteDialog
          title={t('diary.addStudentNote')}
          onClose={() => setAdding(false)}
          onSubmit={(date, fd) => run(() => save.mutateAsync({ date, fd }), t('diary.saved'))}
        />
      )}
      <Dialog open={Boolean(photo)} onClose={() => setPhoto(null)} maxWidth="md">
        {photo && <Box component="img" src={photo} alt="" sx={{ width: '100%' }} />}
      </Dialog>
    </Stack>
  );
}
