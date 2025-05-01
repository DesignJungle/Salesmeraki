'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define currency types
export type Currency = {
  code: string;
  symbol: string;
  name: string;
  symbolPosition: 'before' | 'after';
  decimalSeparator: string;
  thousandsSeparator: string;
  decimalDigits: number;
  exchangeRate: number; // Exchange rate relative to USD (1 USD = X units of this currency)
};

// List of supported currencies with exchange rates (as of a recent date)
// Exchange rates are relative to USD (1 USD = X units of the currency)
export const currencies: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 1.0 // Base currency
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    symbolPosition: 'before',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimalDigits: 2,
    exchangeRate: 0.92 // 1 USD = 0.92 EUR
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 0.79 // 1 USD = 0.79 GBP
  },
  {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 0,
    exchangeRate: 150.14 // 1 USD = 150.14 JPY
  },
  {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 7.24 // 1 USD = 7.24 CNY
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 83.36 // 1 USD = 83.36 INR
  },
  {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    symbolPosition: 'before',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimalDigits: 2,
    exchangeRate: 5.05 // 1 USD = 5.05 BRL
  },
  {
    code: 'RUB',
    symbol: '₽',
    name: 'Russian Ruble',
    symbolPosition: 'after',
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    decimalDigits: 2,
    exchangeRate: 92.35 // 1 USD = 92.35 RUB
  },
  {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 18.73 // 1 USD = 18.73 ZAR
  },
  {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 1464.50 // 1 USD = 1464.50 NGN
  },
  {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 129.75 // 1 USD = 129.75 KES
  },
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 1.52 // 1 USD = 1.52 AUD
  },
  {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 1.37 // 1 USD = 1.37 CAD
  },
  {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 1.35 // 1 USD = 1.35 SGD
  },
  {
    code: 'MXN',
    symbol: 'Mex$',
    name: 'Mexican Peso',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalDigits: 2,
    exchangeRate: 16.82 // 1 USD = 16.82 MXN
  }
];

// Convert USD amount to the target currency
export const convertCurrency = (amountUSD: number, currency: Currency): number => {
  return amountUSD * currency.exchangeRate;
};

// Format a number as currency
export const formatCurrency = (amount: number, currency: Currency, isUSD: boolean = true): string => {
  // Debug log to see currency and amount
  console.log('Formatting amount:', amount, 'Currency:', currency.code, 'isUSD:', isUSD);

  // Convert the amount if it's in USD and we're not using USD
  const convertedAmount = isUSD && currency.code !== 'USD'
    ? convertCurrency(amount, currency)
    : amount;

  console.log('Converted amount:', convertedAmount);

  // Format the number with the correct decimal places
  const formattedNumber = convertedAmount.toFixed(currency.decimalDigits);

  // Split the number into whole and decimal parts
  const [wholePart, decimalPart] = formattedNumber.split('.');

  // Format the whole part with thousands separators
  const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandsSeparator);

  // Combine whole and decimal parts with the correct decimal separator
  let formattedAmount = decimalPart
    ? `${formattedWholePart}${currency.decimalSeparator}${decimalPart}`
    : formattedWholePart;

  // Add the currency symbol in the correct position
  return currency.symbolPosition === 'before'
    ? `${currency.symbol}${formattedAmount}`
    : `${formattedAmount} ${currency.symbol}`;
};

// Create the context
type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number, isUSD?: boolean) => string;
  convertAmount: (amountUSD: number) => number;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Create a provider component
export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(currencies[0]); // Default to USD

  // Load saved currency preference from localStorage on mount
  useEffect(() => {
    const savedCurrencyCode = localStorage.getItem('preferred-currency');
    if (savedCurrencyCode) {
      const savedCurrency = currencies.find(c => c.code === savedCurrencyCode);
      if (savedCurrency) {
        console.log('Loading saved currency:', savedCurrency.code);
        setCurrency(savedCurrency);
      }
    }
  }, []);

  // Force a re-render when the page loads to ensure the currency is properly applied
  useEffect(() => {
    // This will force components to re-render with the correct currency
    const timer = setTimeout(() => {
      setCurrency(prev => ({ ...prev }));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferred-currency', currency.code);
  }, [currency]);

  // Format an amount using the current currency
  // isUSD flag indicates if the amount is in USD and needs conversion
  const formatAmount = (amount: number, isUSD: boolean = true): string => {
    return formatCurrency(amount, currency, isUSD);
  };

  // Convert a USD amount to the current currency
  const convertAmount = (amountUSD: number): number => {
    return convertCurrency(amountUSD, currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, convertAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Create a hook to use the currency context
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
