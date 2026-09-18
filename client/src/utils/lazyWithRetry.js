import { lazy } from "react";

const RETRY_PREFIX = "noblefits.lazy-retry.";

const getSessionStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const lazyWithRetry = (importer, chunkName = "chunk") =>
  lazy(async () => {
    const storage = getSessionStorage();
    const retryKey = `${RETRY_PREFIX}${chunkName}`;

    try {
      const module = await importer();
      storage?.removeItem(retryKey);
      return module;
    } catch (error) {
      if (storage && storage.getItem(retryKey) !== "1") {
        storage.setItem(retryKey, "1");
        window.location.reload();
        return new Promise(() => {});
      }

      storage?.removeItem(retryKey);
      throw error;
    }
  });

export default lazyWithRetry;
