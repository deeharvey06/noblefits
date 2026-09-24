import { normalizeSearchText } from "@/utils/searchCatalog";
const RECENT_SEARCHES_KEY = "noblefits.recentSearches.v1";
const MAX_RECENT_SEARCHES = 5;
const CHANGE_EVENT = "noblefits:recent-searches";
const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT));

const getStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const getRecentSearches = () => {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const stored = JSON.parse(storage.getItem(RECENT_SEARCHES_KEY) || "[]");
    return Array.isArray(stored)
      ? stored
          .filter((item) => typeof item === "string" && item.trim())
          .slice(0, MAX_RECENT_SEARCHES)
      : [];
  } catch {
    return [];
  }
};

export const saveRecentSearch = (query) => {
  const trimmed = query.trim();
  const storage = getStorage();
  if (!trimmed || !storage) return getRecentSearches();

  const normalized = normalizeSearchText(trimmed);
  const next = [
    trimmed,
    ...getRecentSearches().filter(
      (item) => normalizeSearchText(item) !== normalized,
    ),
  ].slice(0, MAX_RECENT_SEARCHES);

  try {
    storage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    notify();
  } catch {
    return getRecentSearches();
  }

  return next;
};

export const clearRecentSearches = () => {
  const storage = getStorage();
  if (!storage) return [];

  try {
    storage.removeItem(RECENT_SEARCHES_KEY);
    notify();
  } catch {
    return getRecentSearches();
  }

  return [];
};

export const subscribeRecentSearches = (listener) => {
  const onStorage = (event) => {
    if (event.key === RECENT_SEARCHES_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
};

export const getRecentSearchesSnapshot = () =>
  JSON.stringify(getRecentSearches());
