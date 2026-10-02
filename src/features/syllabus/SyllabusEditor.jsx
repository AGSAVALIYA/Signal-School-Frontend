import { useState } from 'react';
import { Button, Card, CardContent, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import {
  Add as AddIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const move = (list, i, d) => {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const copy = [...list];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
};

// Edits chapters/topics in place (ids kept), so teachers' "taught" ticks survive renames and reordering.
export default function SyllabusEditor({ chapters, onSave, onCancel, saving }) {
  const { t } = useTranslation();
  const [tree, setTree] = useState(() =>
    chapters.map((c) => ({ id: c.id, name: c.name, topics: c.Topics.map((x) => ({ id: x.id, content: x.content, locked: Boolean(x.completion) })) })),
  );
  const [paste, setPaste] = useState({});
  const setChapter = (i, patch) => setTree((tr) => tr.map((c, k) => (k === i ? { ...c, ...patch } : c)));
  const setTopics = (i, fn) => setChapter(i, { topics: fn(tree[i].topics) });

  const addPasted = (i) => {
    const lines = (paste[i] || '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    setTopics(i, (ts) => [...ts, ...lines.map((content) => ({ content }))]);
    setPaste((p) => ({ ...p, [i]: '' }));
  };

  const submit = () =>
    onSave({
      chapters: tree
        .filter((c) => c.name.trim())
        .map((c) => ({
          ...(c.id ? { id: c.id } : {}),
          name: c.name.trim(),
          topics: c.topics.filter((x) => x.content.trim()).map((x) => ({ ...(x.id ? { id: x.id } : {}), content: x.content.trim() })),
        })),
    });

  return (
    <Stack sx={{ gap: 2 }}>
      {tree.map((c, i) => (
        <Card key={c.id || `new-${i}`}>
          <CardContent>
            <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
              <TextField label={t('syllabus.chapterName')} value={c.name} onChange={(e) => setChapter(i, { name: e.target.value })} />
              <IconButton aria-label={t('common.moveUp')} onClick={() => setTree((tr) => move(tr, i, -1))}>
                <ArrowUpwardIcon />
              </IconButton>
              <IconButton aria-label={t('common.moveDown')} onClick={() => setTree((tr) => move(tr, i, 1))}>
                <ArrowDownwardIcon />
              </IconButton>
              <IconButton
                aria-label={t('syllabus.removeChapter')}
                disabled={c.topics.some((x) => x.locked)}
                onClick={() => setTree((tr) => tr.filter((_, k) => k !== i))}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
            <Stack sx={{ gap: 1, mt: 2, pl: { sm: 2 } }}>
              {c.topics.map((x, j) => (
                <Stack key={x.id || `n-${j}`} direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    value={x.content}
                    onChange={(e) => setTopics(i, (ts) => ts.map((y, k) => (k === j ? { ...y, content: e.target.value } : y)))}
                  />
                  <IconButton size="small" aria-label={t('common.moveUp')} onClick={() => setTopics(i, (ts) => move(ts, j, -1))}>
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>
                  {x.locked ? (
                    <Tooltip title={t('syllabus.taughtLocked')}>
                      <LockIcon color="disabled" sx={{ mx: 1.5 }} />
                    </Tooltip>
                  ) : (
                    <IconButton size="small" aria-label={t('syllabus.removeTopic')} onClick={() => setTopics(i, (ts) => ts.filter((_, k) => k !== j))}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              ))}
              <TextField
                size="small"
                multiline
                minRows={2}
                label={t('syllabus.addTopics')}
                helperText={t('syllabus.pasteHint')}
                value={paste[i] || ''}
                onChange={(e) => setPaste((p) => ({ ...p, [i]: e.target.value }))}
              />
              <Button size="small" startIcon={<AddIcon />} onClick={() => addPasted(i)} disabled={!paste[i]?.trim()} sx={{ alignSelf: 'flex-start' }}>
                {t('syllabus.addTheseTopics')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
      <Button startIcon={<AddIcon />} variant="outlined" onClick={() => setTree((tr) => [...tr, { name: '', topics: [] }])} sx={{ alignSelf: 'flex-start' }}>
        {t('syllabus.addChapter')}
      </Button>
      <Stack direction="row" sx={{ gap: 1, position: 'sticky', bottom: 16 }}>
        <Button variant="contained" size="large" onClick={submit} disabled={saving} sx={{ boxShadow: 3 }}>
          {saving ? t('common.saving') : t('common.save')}
        </Button>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
      </Stack>
    </Stack>
  );
}
