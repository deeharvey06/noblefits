import { bootstrapApplication } from "@/app/bootstrap";
import { checkUserSession } from "@/redux/user/actions";
import { fetchCollectionsStart } from "@/redux/shop/actions";

it("starts authentication and catalog loading once per store", () => {
  const store = { dispatch: jest.fn() };
  bootstrapApplication(store);
  bootstrapApplication(store);
  expect(store.dispatch.mock.calls).toEqual([
    [checkUserSession()],
    [fetchCollectionsStart()],
  ]);
  const secondStore = { dispatch: jest.fn() };
  bootstrapApplication(secondStore);
  expect(secondStore.dispatch).toHaveBeenCalledTimes(2);
});
