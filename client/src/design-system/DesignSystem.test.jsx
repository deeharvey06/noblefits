import { vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  Button,
  InputField,
  QuantityControl,
  ProductCard,
  Tabs,
  Dialog,
  Tooltip,
} from "./index";

test("Button exposes loading state and disables interaction", () => {
  render(<Button loading>Save</Button>);

  const button = screen.getByRole("button", { name: /save/i });
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("aria-busy", "true");
});

test("InputField links error text to the input", () => {
  render(
    <InputField
      id="email"
      label="Email"
      error="Enter a valid email"
      value=""
      onChange={() => {}}
    />
  );

  const input = screen.getByLabelText("Email");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAttribute("aria-describedby", "email-message");
  expect(input).toHaveAttribute("aria-errormessage", "email-message");
  expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
});

test("QuantityControl honors minimum quantity", () => {
  const decrease = vi.fn();
  render(
    <QuantityControl
      value={1}
      min={1}
      onDecrease={decrease}
      onIncrease={() => {}}
    />
  );

  expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeDisabled();
});


test("ProductCard confirms Add to Bag without changing the cart contract", () => {
  const onAddToCart = vi.fn();
  render(
    <ProductCard
      name="Test jacket"
      imageUrl="/test-jacket.jpg"
      price={120}
      onAddToCart={onAddToCart}
    />
  );

  fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
  expect(onAddToCart).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: /added to bag/i })).toHaveAttribute(
    "data-success",
    "true"
  );
});

test("Tabs changes selection through keyboard navigation", () => {
  const onChange = vi.fn();
  render(
    <Tabs
      activeId="details"
      onChange={onChange}
      items={[
        { id: "details", label: "Details", panel: "Details panel" },
        { id: "shipping", label: "Shipping", panel: "Shipping panel" },
      ]}
    />
  );

  fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
  expect(onChange).toHaveBeenCalledWith("shipping");
});

test("Dialog closes with Escape", () => {
  const onClose = vi.fn();
  render(
    <Dialog open title="Size guide" onClose={onClose}>
      Content
    </Dialog>
  );

  fireEvent.keyDown(document, { key: "Escape" });
  expect(onClose).toHaveBeenCalledTimes(1);
});


test("Dialog isolates background content while open", () => {
  const appRoot = document.createElement("div");
  appRoot.id = "root";
  document.body.appendChild(appRoot);

  const { unmount } = render(
    <Dialog open title="Account options" onClose={() => {}}>
      Content
    </Dialog>,
    { container: appRoot }
  );

  expect(appRoot).toHaveAttribute("inert");
  expect(appRoot).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByRole("dialog", { name: /account options/i })).toBeInTheDocument();

  unmount();
  expect(appRoot).not.toHaveAttribute("inert");
  appRoot.remove();
});

test("Tooltip exposes content as an accessible description", () => {
  render(
    <Tooltip content="Saved locally">
      <button type="button">Storage details</button>
    </Tooltip>
  );

  const trigger = screen.getByRole("button", { name: /storage details/i });
  const tooltip = screen.getByRole("tooltip");
  expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);

  fireEvent.focus(trigger);
  expect(tooltip.parentElement).toHaveAttribute("data-visible", "true");
  fireEvent.keyDown(trigger, { key: "Escape" });
  expect(tooltip.parentElement).not.toHaveAttribute("data-visible");
});
