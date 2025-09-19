// Utility functions for formatting numbers and currency

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-NG');
};