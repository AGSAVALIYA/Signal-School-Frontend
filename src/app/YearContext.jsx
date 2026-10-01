import { createContext, useContext, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { session } from '../api/session';
import { useGet, useSession } from '../api/hooks';

const YearContext = createContext(null);

// Selected academic year for viewing. null = the school's current (active) year.
export function YearProvider({ children }) {
  const s = useSession();
  const qc = useQueryClient();
  const { data, refetch } = useGet(s.schoolId ? '/academic-years' : null, undefined, { staleTime: 60000, meta: { noYear: true } });
  const years = useMemo(() => data?.data ?? [], [data]);

  const value = useMemo(() => {
    const current = years.find((y) => y.status === 'active') || null;
    const selected = (s.yearId && years.find((y) => y.id === s.yearId)) || current;
    const readOnly = Boolean(selected && selected.status === 'closed' && !(selected.unlockedUntil && new Date(selected.unlockedUntil) > new Date()));
    return {
      years,
      current,
      selected,
      isPast: Boolean(selected && current && selected.id !== current.id),
      readOnly,
      refetch,
      setYear(id) {
        session.set({ yearId: id && id !== current?.id ? id : null });
        qc.invalidateQueries();
      },
    };
  }, [years, s.yearId, qc, refetch]);

  return <YearContext.Provider value={value}>{children}</YearContext.Provider>;
}

export const useYear = () => useContext(YearContext);
