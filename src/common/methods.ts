export const currencyFormatter = (value: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    currency: "USD",
  });

  return formatter.format(value);
};
