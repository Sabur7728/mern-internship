import { useCallback, useEffect, useState } from "react";

// `fetcher` must be a stable function (module-level or wrapped in useCallback)
export default function useFetch(fetcher) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetcher());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, reload: load };
}