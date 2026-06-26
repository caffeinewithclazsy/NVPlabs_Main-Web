import { useState, useEffect } from "react";
import { api } from "./api";

/**
 * Hook to fetch a list (or object) from the backend, with a static fallback
 * so the page never appears empty on a slow / errored network.
 */
export function useApiList(path, fallback = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    api
      .get(path)
      .then(({ data }) => {
        if (!alive) return;
        if (Array.isArray(data) ? data.length > 0 : Object.keys(data || {}).length > 0) {
          setData(data);
        }
      })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [path]);
  return { data, loading };
}
