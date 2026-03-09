export * from './categories';
export * from './spacing';
export * from './typography';

// Supported currencies
export const currencies = [
    { code: 'LKR', symbol: 'Rs.', name: 'Sri Lankan Rupee', locale: 'si-LK' },
    { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
    { code: 'EUR', symbol: '€', name: 'Euro', locale: 'en-EU' },
    { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'hi-IN' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
] as const;

// Default currency
export const defaultCurrency = currencies[0]; // LKR