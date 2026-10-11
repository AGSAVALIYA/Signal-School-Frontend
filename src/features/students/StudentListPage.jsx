import { keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Fab,
  FormControlLabel,
  Grid,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGet, useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { useYear } from '../../app/YearContext';
import { can } from '../../shared/utils/permissions';
import { EmptyState, ListSkeleton, PageHeader, Query, StatusChip } from '../../shared/components/ui';
import { useIcons } from '../../theme/LookContext';
import SectionSelect from '../../shared/components/SectionSelect';
import useDebounce from '../../shared/hooks/useDebounce';
import { useAction, useNotify } from '../../shared/hooks/useNotify';
import { initials } from '../../shared/utils/format';
import StudentForm from './StudentForm';

const PAGE = 50;

export default function StudentListPage() {
  const { t } = useTranslation();
  const I = useIcons();
  const navigate = useNavigate();
  const notify = useNotify();
  const { role } = useAuth();
  const { readOnly } = useYear();
  const [params, setParams] = useSearchParams();
  const sectionId = params.get('sectionId') ? Number(params.get('sectionId')) : null;
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('active');
  const [allYears, setAllYears] = useState(false);
  // Searching all years is mostly for children who left, so it widens the default "Studying" filter (and back).
  const toggleAllYears = (on) => {
    setAllYears(on);
    if (on && status === 'active') setStatus('all');
    if (!on && status === 'all') setStatus('active');
  };
  const [pageSize, setPageSize] = useState(PAGE);
  const [adding, setAdding] = useState(false);
  const search = useDebounce(q);
  const run = useAction();
  // Keep the current rows on screen while "show more" or a new search loads (no spinner, scroll position kept).
  const query = useGet(
    '/students',
    { sectionId: sectionId || undefined, q: search || undefined, status, allYears: String(allYears), pageSize },
    { placeholderData: keepPreviousData },
  );
  const canAdd = can(role, 'students.write') && !readOnly;
  const create = useSend((body) => api.post('/students', body), { invalidate: ['/students', '/sections', '/today'] });

  return (
    <>
      <PageHeader
        title={t('nav.students')}
        icon="students"
        subtitle={query.data?.meta ? t('students.count', { count: query.data.meta.total }) : undefined}
        help={t('help.students')}
        actions={
          <>
            {canAdd && (
              <Button variant="contained" startIcon={<I.addPerson />} onClick={() => setAdding(true)} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                {t('students.add')}
              </Button>
            )}
            {can(role, 'students.import') && !readOnly && (
              <Button startIcon={<I.upload />} component={RouterLink} to="/students/import" variant="outlined">
                {t('import.title')}
              </Button>
            )}
            {role !== 'teacher' && (
              <Button
                startIcon={<I.download />}
                variant="outlined"
                onClick={() => run(() => api.download('/students-export', { sectionId: sectionId || undefined }, 'students.xlsx'))}
              >
                {t('common.downloadExcel')}
              </Button>
            )}
          </>
        }
      />
      <Grid container spacing={1.5} sx={{ mb: 2, alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            placeholder={t('students.searchPlaceholder')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            slotProps={{
              htmlInput: { 'aria-label': t('common.search') },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <I.search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SectionSelect allowAll value={sectionId} onChange={(v) => setParams(v ? { sectionId: String(v) } : {})} disabled={allYears} />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField select label={t('common.status')} value={status} onChange={(e) => setStatus(e.target.value)}>
            {['active', 'left', 'graduated', 'all'].map((s) => (
              <MenuItem key={s} value={s}>
                {s === 'all' ? t('common.all') : t(`students.statuses.${s}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <FormControlLabel control={<Checkbox checked={allYears} onChange={(e) => toggleAllYears(e.target.checked)} />} label={t('students.allYears')} />
        </Grid>
      </Grid>
      <Query q={query} loading={<ListSkeleton />}>
        {({ data, meta }) =>
          data.length ? (
            <Card>
              <List component="div" disablePadding>
                {data.map((s) => (
                  <ListItemButton key={s.id} onClick={() => navigate(`/students/${s.id}`)} divider sx={{ gap: 1, py: 1.25 }}>
                    <ListItemAvatar>
                      <Avatar src={s.thumbUrl || undefined} alt="" slotProps={{ img: { loading: 'lazy' } }} sx={{ width: 44, height: 44 }}>
                        {initials(s.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={s.name}
                      slotProps={{ primary: { sx: { fontWeight: 600 } } }}
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
            <EmptyState
              icon="students"
              title={t('students.none')}
              action={
                canAdd && (
                  // On phones the floating button is already there.
                  <Button variant="contained" startIcon={<I.addPerson />} onClick={() => setAdding(true)} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                    {t('students.add')}
                  </Button>
                )
              }
            />
          )
        }
      </Query>
      {canAdd && (
        // Room under the last child so the floating button never covers it.
        <Box sx={{ display: { xs: 'block', sm: 'none' }, height: 72 }} />
      )}
      {canAdd && (
        <Fab
          variant="extended"
          color="primary"
          onClick={() => setAdding(true)}
          sx={{
            display: { xs: 'inline-flex', sm: 'none' },
            position: 'fixed',
            right: 16,
            bottom: 'calc(84px + env(safe-area-inset-bottom, 0px))',
            zIndex: 9,
            gap: 1,
          }}
        >
          <I.addPerson />
          {t('students.add')}
        </Fab>
      )}
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
