import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Download as DownloadIcon, PersonAdd as PersonAddIcon, Search as SearchIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { useYear } from '../../app/YearContext';
import { can } from '../../shared/utils/permissions';
import { EmptyState, PageHeader, Query, StatusChip } from '../../shared/components/ui';
import SectionSelect from '../../shared/components/SectionSelect';
import useDebounce from '../../shared/hooks/useDebounce';
import { useAction, useNotify } from '../../shared/hooks/useNotify';
import { initials } from '../../shared/utils/format';
import StudentForm from './StudentForm';

const PAGE = 50;

export default function StudentListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const notify = useNotify();
  const { role } = useAuth();
  const { readOnly } = useYear();
  const [params, setParams] = useSearchParams();
  const sectionId = params.get('sectionId') ? Number(params.get('sectionId')) : null;
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('active');
  const [allYears, setAllYears] = useState(false);
  const [pageSize, setPageSize] = useState(PAGE);
  const [adding, setAdding] = useState(false);
  const search = useDebounce(q);
  const run = useAction();
  const query = useGet('/students', { sectionId: sectionId || undefined, q: search || undefined, status, allYears: String(allYears), pageSize });
  const create = useSend((body) => api.post('/students', body), { invalidate: ['/students', '/sections', '/today'] });

  return (
    <>
      <PageHeader
        title={t('nav.students')}
        help={t('help.students')}
        actions={
          <>
            {can(role, 'students.write') && !readOnly && (
              <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setAdding(true)}>
                {t('students.add')}
              </Button>
            )}
            {can(role, 'students.import') && !readOnly && (
              <Button startIcon={<UploadFileIcon />} component={RouterLink} to="/students/import" variant="outlined">
                {t('import.title')}
              </Button>
            )}
            {role !== 'teacher' && (
              <Button
                startIcon={<DownloadIcon />}
                variant="outlined"
                onClick={() => run(() => api.download('/students-export', { sectionId: sectionId || undefined }, 'students.xlsx'))}
              >
                {t('common.downloadExcel')}
              </Button>
            )}
          </>
        }
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <TextField
          placeholder={t('students.searchPlaceholder')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{ flex: 2, minWidth: 220 }}
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
        <SectionSelect
          allowAll
          value={sectionId}
          onChange={(v) => setParams(v ? { sectionId: String(v) } : {})}
          sx={{ flex: 1, minWidth: 160 }}
          disabled={allYears}
        />
        <TextField select label={t('common.status')} value={status} onChange={(e) => setStatus(e.target.value)} sx={{ flex: 1, minWidth: 140 }}>
          {['active', 'left', 'graduated', 'all'].map((s) => (
            <MenuItem key={s} value={s}>
              {s === 'all' ? t('common.all') : t(`students.statuses.${s}`)}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel control={<Checkbox checked={allYears} onChange={(e) => setAllYears(e.target.checked)} />} label={t('students.allYears')} />
      </Stack>
      <Query q={query}>
        {({ data, meta }) =>
          data.length ? (
            <Card>
              <List disablePadding>
                {data.map((s) => (
                  <ListItemButton key={s.id} onClick={() => navigate(`/students/${s.id}`)} divider sx={{ gap: 1, flexWrap: 'wrap' }}>
                    <ListItemAvatar>
                      <Avatar src={s.photoUrl || undefined} alt="">
                        {initials(s.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={s.name}
                      secondary={[
                        s.enrollment?.sectionName,
                        s.enrollment?.rollNumber && `${t('students.fields.rollNumber')} ${s.enrollment.rollNumber}`,
                        `GR ${s.grNumber}`,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                      sx={{ minWidth: 0 }}
                    />
                    <Box>
                      {s.status !== 'active' ? (
                        <Typography sx={{ color: 'text.secondary' }}>{t(`students.statuses.${s.status}`)}</Typography>
                      ) : (
                        !allYears && <StatusChip status={s.todayStatus} />
                      )}
                    </Box>
                  </ListItemButton>
                ))}
              </List>
              {meta.total > data.length && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button onClick={() => setPageSize((p) => p + PAGE)}>{t('common.showMore', { shown: data.length, total: meta.total })}</Button>
                </Box>
              )}
            </Card>
          ) : (
            <EmptyState title={t('students.none')} />
          )
        }
      </Query>
      {adding && (
        <StudentForm
          sectionId={sectionId}
          onClose={() => setAdding(false)}
          onSubmit={async (body) => {
            const { data } = await create.mutateAsync(body);
            notify.success(t('students.created', { name: data.name, gr: data.grNumber }));
          }}
        />
      )}
    </>
  );
}
