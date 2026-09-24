import { fireEvent, render, screen } from "@testing-library/react";
import ErrorBoundary from "@/components/errorBoundary/errorBoundary";

const Content = ({ crash }) => {
  if (crash) throw new Error("Test failure");
  return <p>Recovered content</p>;
};
let errorSpy;
beforeEach(() => {
  errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => errorSpy.mockRestore());

it("offers a retry after a rendering failure", () => {
  const { rerender } = render(
    <ErrorBoundary resetKey="first">
      <Content crash />
    </ErrorBoundary>,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  rerender(
    <ErrorBoundary resetKey="first">
      <Content crash={false} />
    </ErrorBoundary>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(screen.getByText("Recovered content")).toBeInTheDocument();
});

it("recovers automatically when the route reset key changes", () => {
  const { rerender } = render(
    <ErrorBoundary resetKey="first">
      <Content crash />
    </ErrorBoundary>,
  );
  rerender(
    <ErrorBoundary resetKey="second">
      <Content crash={false} />
    </ErrorBoundary>,
  );
  expect(screen.getByText("Recovered content")).toBeInTheDocument();
});
