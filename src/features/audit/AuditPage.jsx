import { useState } from 'react';
import { Box, Button, Card, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../api/hooks';
import { EmptyState, PageHeader, Query } from '../../shared/components/ui';
import { fmtDateTime } from '../../shared/utils/format';

export default function AuditPage() {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(50);
  const q = useGet('/audit', { pageSize });
  return (
    <>
      <PageHeader title={t('nav.audit')} subtitle={t('audit.subtitle')} />
      <Query q={q}>
        {({ data, meta }) =>
          data.length ? (
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
              {meta.total > data.length && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button onClick={() => setPageSize((p) => Math.min(p + 50, 100))} disabled={pageSize >= 100}>
                    {t('common.showMore', { shown: data.length, total: meta.total })}
                  </Button>
                </Box>
              )}
            </Card>
          ) : (
            <EmptyState title={t('audit.none')} />
          )
        }
      </Query>
    </>
  );
}
