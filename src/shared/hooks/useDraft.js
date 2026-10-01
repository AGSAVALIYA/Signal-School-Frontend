import { useState } from 'react';

// Editable local copy of server data that resets whenever the source object changes
// (refetch, other class/date). React's "adjust state during render" pattern, no effect needed.
export default function useDraft(source, init = (x) => x) {
  const [prev, setPrev] = useState(source);
  const [draft, setDraft] = useState(() => init(source));
  if (prev !== source) {
    setPrev(source);
    setDraft(init(source));
  }
  return [draft, setDraft];
}
