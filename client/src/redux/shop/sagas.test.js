import { runSaga } from "redux-saga";
import { fetchCollectionsAsync } from "@/redux/shop/sagas";
import { catalogApi } from "@/api/catalogApi";

jest.mock("@/api/catalogApi", () => ({
  catalogApi: { getCollections: jest.fn() },
}));

it("keeps the storefront usable when the remote catalog is unavailable", async () => {
  catalogApi.getCollections.mockRejectedValue(new Error("Offline"));
  const actions = [];
  await runSaga(
    { dispatch: (action) => actions.push(action) },
    fetchCollectionsAsync,
  ).toPromise();
  expect(actions).toHaveLength(1);
  expect(actions[0].payload.hats.items.length).toBeGreaterThan(0);
  expect(actions[0].payload.jackets.items.length).toBeGreaterThan(0);
});
