import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';
import { api } from './client';
import { session } from './session';

export const useSession = () => useSyncExternalStore(session.subscribe, session.get);

// Query keyed by URL + params + school + year, so switching school or year refetches cleanly.
export function useGet(url, params, options = {}) {
  const { schoolId, yearId } = useSession();
  return useQuery({
    queryKey: [url, params ?? null, schoolId ?? null, yearId ?? null],
    queryFn: () => api.get(url, params).then((r) => r),
    enabled: Boolean(url) && (options.enabled ?? true),
    ...options,
  });
}

// Mutation that invalidates queries whose URL starts with any of `invalidate` prefixes.
export function useSend(fn, { invalidate = [], onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: async (data, vars) => {
      await qc.invalidateQueries({ predicate: (q) => invalidate.some((p) => String(q.queryKey[0]).startsWith(p)) });
      onSuccess?.(data, vars);
    },
  });
}
