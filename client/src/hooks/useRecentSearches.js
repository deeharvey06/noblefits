import { useMemo, useSyncExternalStore } from "react";
import {
  subscribeRecentSearches,
  getRecentSearchesSnapshot,
  saveRecentSearch,
  clearRecentSearches,
} from "@/services/recentSearches";

const getServerSnapshot = () => "[]";

export const useRecentSearches = () => {
  const snapshot = useSyncExternalStore(
    subscribeRecentSearches,
    getRecentSearchesSnapshot,
    getServerSnapshot,
  );
  const recentSearches = useMemo(() => JSON.parse(snapshot), [snapshot]);
  return { recentSearches, saveRecentSearch, clearRecentSearches };
};
