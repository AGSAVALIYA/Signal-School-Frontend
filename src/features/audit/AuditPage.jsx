import { keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { Box, Button, Card, List, ListItem, ListItemText, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { EmptyState, PageHeader, Query } from '../../shared/components/ui';
import { fmtDateTime } from '../../shared/utils/format';

const PAGE = 50;
// Kinds of change shown to the principal → action prefixes understood by GET /audit?areas=
const AREAS = {
  attendance: ['attendance'],
  students: ['student'],
  teaching: ['syllabus', 'marks', 'diary'],
  health: ['health'],
  staff: ['user', 'assignment'],
  years: ['year'],
  setup: ['school', 'organization', 'section', 'subject', 'grade', 'holiday'],
};

export default function AuditPage() {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('');
  const [area, setArea] = useState('');
  const [page, setPage] = useState(1);
  const staff = useGet('/users');
  const q = useGet(
    '/audit',
    { pageSize: PAGE, page, userId: userId || undefined, areas: area ? AREAS[area].join(',') : undefined },
    { placeholderData: keepPreviousData },
  );
  const filter = (set) => (e) => {
    set(e.target.value);
    setPage(1);
  };
  return (
    <>
      <PageHeader title={t('nav.audit')} subtitle={t('audit.subtitle')} />
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, mb: 2 }}>
        <TextField select label={t('audit.person')} value={userId} onChange={filter(setUserId)} sx={{ maxWidth: { sm: 280 } }}>
          <MenuItem value="">{t('common.all')}</MenuItem>
          {(staff.data?.data || []).map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField select label={t('audit.area')} value={area} onChange={filter(setArea)} sx={{ maxWidth: { sm: 280 } }}>
          <MenuItem value="">{t('common.all')}</MenuItem>
          {Object.keys(AREAS).map((k) => (
            <MenuItem key={k} value={k}>
              {t(`audit.areas.${k}`)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Query q={q}>
        {({ data, meta }) => {
          const pages = Math.max(1, Math.ceil(meta.total / PAGE));
          return data.length ? (
            <Card>
              <List disablePadding>
                {data.map((l) => (
                  <ListItem key={l.id} divider>
                    <ListItemText
                      primary={
                        <Typography>
                          <b>{l.User?.name || '–'}</b> · {t(`audit.actions.${l.action}`, { defaultValue: l.action })}
                        </Typography>
                      }
                      secondary={`${fmtDateTime(l.createdAt)}${l.summary ? ` · ${l.summary}` : ''}`}
                    />
                  </ListItem>
                ))}
              </List>
              {pages > 1 && (
                <Stack direction="row" sx={{ p: 2, gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    {t('common.newer')}
                  </Button>
                  <Box sx={{ color: 'text.secondary' }}>{t('common.pageOf', { page, pages })}</Box>
                  <Button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                    {t('common.older')}
                  </Button>
                </Stack>
              )}
            </Card>
          ) : (
            <EmptyState title={t('audit.none')} />
          );
        }}
      </Query>
    </>
  );
}
