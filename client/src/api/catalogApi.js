import { fetchCollections } from "@/api/firebaseClient";

export const catalogApi = { getCollections: () => fetchCollections() };
