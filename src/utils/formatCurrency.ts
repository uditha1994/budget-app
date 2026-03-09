import { Currency } from '../types';

export const formatCurrency = (
    amount: number,
    currency: Currency,
    options?: {
        showSign?: boolean;
        compact?: boolean;
        decimals?: number;
    }
): string => {
    const { showSign = false, compact = false, decimals = 2 } = options || {};

    let formattedAmount: string;

    if (compact && Math.abs(amount) >= 1000000) {
        formattedAmount = (amount / 1000000).toFixed(1) + 'M';
    } else if (compact && Math.abs(amount) >= 1000) {
        formattedAmount = (amount / 1000).toFixed(1) + 'K';
    } else {
        formattedAmount = Math.abs(amount).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }

    const sign = showSign && amount > 0 ? '+' : amount < 0 ? '-' : '';

    return `${sign}${currency.symbol} ${formattedAmount}`;
};

export const formatNumber = (num: number, decimals: number = 0): string => {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};