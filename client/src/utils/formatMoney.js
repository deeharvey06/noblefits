const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatMoney = (value) =>
  currencyFormatter.format(Number(value) || 0);
