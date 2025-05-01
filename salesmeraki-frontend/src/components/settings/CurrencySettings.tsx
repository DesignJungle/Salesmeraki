'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency, currencies, Currency, convertCurrency } from '@/contexts/CurrencyContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CurrencyDollarIcon, GlobeAltIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

export const CurrencySettings: React.FC = () => {
  const { currency, setCurrency, formatAmount } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter currencies based on search query
  const filteredCurrencies = currencies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Example amounts to show formatting and conversion
  const exampleAmount = 1234567.89;
  const exampleUsdAmount = 100;

  // Debug log to see currency changes
  useEffect(() => {
    console.log('Current currency:', currency);
  }, [currency]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.currency-selector')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card>
      <div className="flex items-center mb-4">
        <GlobeAltIcon className="h-5 w-5 mr-2 text-primary" />
        <h3 className="text-lg font-medium">Currency Settings</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Select your preferred currency for displaying monetary values throughout the application.
      </p>

      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-1">Current Currency</div>
        <div className="flex items-center">
          <span className="text-lg font-semibold mr-2">{currency.code} ({currency.symbol})</span>
          <span className="text-gray-500">{currency.name}</span>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          Example: {formatAmount(exampleAmount)}
        </div>
      </div>

      <div className="relative currency-selector">
        <div className="text-sm font-medium text-gray-700 mb-1">Change Currency</div>
        <div className="flex">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Search currencies..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!showDropdown) setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            <CurrencyDollarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((c) => (
                <button
                  key={c.code}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between ${
                    c.code === currency.code ? 'bg-primary-50 text-primary' : ''
                  }`}
                  onClick={() => {
                    console.log('Setting currency to:', c.code);
                    setCurrency(c);
                    // Force a reload to ensure all components update with the new currency
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                    setShowDropdown(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{c.code}</span>
                    <span className="ml-2 text-gray-600">{c.name}</span>
                  </div>
                  <span>{c.symbol}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No currencies found</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="text-sm font-medium text-gray-700 mb-2">Currency Format Preview</div>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Symbol Position</div>
              <div className="font-medium">{currency.symbolPosition === 'before' ? 'Before amount' : 'After amount'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Decimal Separator</div>
              <div className="font-medium">{currency.decimalSeparator === '.' ? 'Period (.)' : 'Comma (,)'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Thousands Separator</div>
              <div className="font-medium">
                {currency.thousandsSeparator === ',' ? 'Comma (,)' :
                 currency.thousandsSeparator === '.' ? 'Period (.)' :
                 currency.thousandsSeparator === ' ' ? 'Space ( )' : currency.thousandsSeparator}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Decimal Digits</div>
              <div className="font-medium">{currency.decimalDigits}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center mb-2">
          <ArrowsRightLeftIcon className="h-4 w-4 mr-2 text-primary" />
          <div className="text-sm font-medium text-gray-700">Exchange Rate</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Current Rate</div>
            <div className="font-medium">
              1 USD = {currency.exchangeRate} {currency.code}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm text-gray-500 mb-2">Conversion Example</div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center">
                <span>$100.00 USD</span>
                <span>=</span>
                <span className="font-medium">{formatAmount(exampleUsdAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
