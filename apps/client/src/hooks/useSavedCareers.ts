import { useCallback, useEffect, useState } from "react";
import { fetchSavedCareers, removeSavedCareer, saveCareer } from "../api";
import type { Career, SavedCareerRecord } from "../types";

export function useSavedCareers() {
  const [savedCareers, setSavedCareers] = useState<SavedCareerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const refresh = useCallback(async () => {
    if (!token) {
      setSavedCareers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const saved = await fetchSavedCareers();
      setSavedCareers(saved);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load saved careers"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const isSaved = useCallback(
    (careerId: string) =>
      savedCareers.some((entry) => entry.careerId === careerId),
    [savedCareers]
  );

  const toggleSave = useCallback(
    async (career: Career) => {
      try {
        if (isSaved(career._id)) {
          await removeSavedCareer(career._id);
          setStatusMessage(`${career.title} removed from saved careers`);
        } else {
          await saveCareer(career._id);
          setStatusMessage(`${career.title} saved to your list`);
        }

        await refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update saved careers"
        );
      }
    },
    [isSaved, refresh]
  );

  const remove = useCallback(
    async (careerId: string) => {
      try {
        await removeSavedCareer(careerId);
        setStatusMessage("Saved career removed");
        await refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to remove saved career"
        );
      }
    },
    [refresh]
  );

  const recent = savedCareers.slice(0, 3);

  return {
    savedCareers,
    recent,
    loading,
    error,
    statusMessage,
    isSaved,
    toggleSave,
    remove,
    refresh,
    clearStatus: () => setStatusMessage(null),
  };
}
