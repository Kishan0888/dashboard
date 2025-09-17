export const formatCurrency = (value: number, currency: string = 'INR') =>
	new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(value || 0));

export const formatNumber = (value: number) =>
	new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value || 0));

export const formatPercent = (value: number) => `${Number(value || 0).toFixed(1)}%`;
