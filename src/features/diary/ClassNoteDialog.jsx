import { useTranslation } from 'react-i18next';
import { useSend } from '../../api/hooks';
import { api } from '../../api/client';
import { useAction } from '../../shared/hooks/useNotify';
import { useSections } from '../../shared/components/SectionSelect';
import NoteDialog from './NoteDialog';

export default function ClassNoteDialog({ section, onClose }) {
  const { t } = useTranslation();
  const run = useAction();
  const { sections } = useSections();
  const subjects = sections.find((s) => s.id === section.id)?.Subjects || [];
  const save = useSend(({ date, fd }) => api.put(`/diary/sections/${section.id}/${date}`, fd), { invalidate: ['/diary'] });
  return (
    <NoteDialog
      title={t('diary.classNoteTitle', { name: section.name })}
      subjects={subjects}
      onClose={onClose}
      onSubmit={(date, fd) => run(() => save.mutateAsync({ date, fd }), t('diary.saved'))}
    />
  );
}
