import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
export default function useFetch(path) {
  const [state, set] = useState({ data: null, loading: true, error: '' });
  const load = useCallback(() => {
    let live = true;
    set((s) => ({ ...s, loading: true, error: '' }));
    api(path).then((data) => live && set({ data, loading: false, error: '' }))
      .catch((e) => live && set({ data: null, loading: false, error: e.message }));
    return () => { live = false; };
  }, [path]);
  useEffect(() => load(), [load]);
  return { ...state, reload: load };
}
