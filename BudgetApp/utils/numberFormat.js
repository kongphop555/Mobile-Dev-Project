// Format number to have commas and no decimal places
export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Clean input to only allow numbers
export const cleanNumberInput = (text) => {
  return text.replace(/[^0-9]/g, '');
};

// Format currency for display (with ฿ symbol)
export const formatCurrency = (amount) => {
  return `฿${formatNumber(amount)}`;
}; 