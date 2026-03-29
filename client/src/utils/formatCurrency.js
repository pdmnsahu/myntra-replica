export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDiscount = (price, mrp) => {
  return Math.round(((mrp - price) / mrp) * 100);
};
