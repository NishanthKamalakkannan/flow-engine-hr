import { useEffect, useState } from "react";
import { getAutomations } from "../api/workflowApi";

/**
 * Custom hook to fetch the list of available automation actions
 * from the mock API. Returns loading state + data.
 */
export function useAutomations() {
  const [automations, setAutomations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAutomations().then((data) => {
      if (!cancelled) {
        setAutomations(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { automations, loading };
}
