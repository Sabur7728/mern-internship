import { useEffect, useState } from 'react';
import { api } from '../services/api';
export default function useFetch(path) {
  const [s, set] = useState({ data: null, loading: true, error: '' }), [n, setN] = useState(0);
  useEffect(() => {
    let ok = true; set(x => ({ ...x, loading: true, error: '' }));
    api(path).then(d => ok && set({ data: d, loading: false, error: '' })).catch(e => ok && set({ data: null, loading: false, error: e.message }));
    return () => { ok = false; };
  }, [path, n]);
  return { ...s, reload: () => setN(x => x + 1) };
}
