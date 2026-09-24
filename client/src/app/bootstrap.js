import { fetchCollectionsStart } from "@/redux/shop/actions";
import { checkUserSession } from "@/redux/user/actions";

const startedStores = new WeakSet();

export const bootstrapApplication = (store) => {
  if (startedStores.has(store)) return;
  startedStores.add(store);
  store.dispatch(checkUserSession());
  store.dispatch(fetchCollectionsStart());
};
