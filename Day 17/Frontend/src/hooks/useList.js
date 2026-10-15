import { useCallback, useEffect, useState } from "react";

export default function useList(fetcher, initialFilters = {}) {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      Object.entries(filters).forEach(([k, v]) => v !== "" && v != null && params.set(k, v));
      const res = await fetcher(`?${params}`);
      setItems(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetcher, filters, page]);

  // debounce so we don't call the API on every keystroke
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const updateFilter = (name, value) => {
    setPage(1); // reset page when filters change
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return { items, setItems, filters, updateFilter, page, setPage, pagination, loading, error, setError, reload: load };
}