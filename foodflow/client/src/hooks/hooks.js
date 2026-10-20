import { useEffect, useState } from 'react';
export function useFetch(fn, deps = []) {
  const [state, set] = useState({ data: null, loading: true, error: '' });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    set((s) => ({ ...s, loading: true, error: '' }));
    fn().then((d) => live && set({ data: d, loading: false, error: '' }))
      .catch((e) => live && set({ data: null, loading: false, error: e.message }));
    return () => { live = false; };
    // eslint-disable-next-line
  }, [...deps, tick]);
  return { ...state, reload: () => setTick((t) => t + 1) };
}
export function useDebounce(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return v;
}
