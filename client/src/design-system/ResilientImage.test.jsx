import { fireEvent, render, screen } from "@testing-library/react";
import ResilientImage from "@/design-system/ResilientImage";

it("recovers from a failed image when navigation supplies a new source", () => {
  const { rerender } = render(
    <ResilientImage src="/broken.jpg" alt="First jacket" />,
  );
  fireEvent.error(screen.getByRole("img", { name: "First jacket" }));
  expect(
    screen.getByRole("img", { name: /First jacket. Image unavailable/ }),
  ).toBeInTheDocument();
  rerender(<ResilientImage src="/working.jpg" alt="Second jacket" />);
  expect(screen.getByRole("img", { name: "Second jacket" })).toHaveAttribute(
    "src",
    "/working.jpg",
  );
  expect(screen.queryByText("Image unavailable")).not.toBeInTheDocument();
});

it("keeps decorative missing images out of the accessibility tree", () => {
  render(<ResilientImage src="" alt="" />);
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByText("Image unavailable").parentElement).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});
