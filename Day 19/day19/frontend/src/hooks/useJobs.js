import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export default function useJobs({ search = "", page = 1, limit = 9 }) {
  const [state, setState] = useState({ jobs: [], pagination: null, loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    api
      .get("/jobs", { params: { search, page, limit }, signal: controller.signal })
      .then((res) =>
        setState({ jobs: res.data.data, pagination: res.data.pagination, loading: false, error: null })
      )
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        setState((s) => ({
          ...s,
          loading: false,
          error: err.response?.data?.message || "Unable to load jobs. Please try again.",
        }));
      });

    return () => controller.abort();
  }, [search, page, limit, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);
  return { ...state, retry };
}
