'use client';

import { useState } from 'react';
import { useFlaunchQuote } from '../hooks/useFlaunchQuote';
import useDebounce from '../hooks/useDebounce';

const FLAUNCH_TOKEN = '0x3025e7854482bcfb770b0b204a6a8ad11c5152a9'; // Test token (QUESTION), replace with together token in production

const SwapInterface = () => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const debouncedAmount = useDebounce(amount, 500); // 500ms debounce delay

  const {
    data: quotedAmount,
    isLoading: isQuoteLoading,
    isFetching: isQuoteFetching,
    isError: isQuoteError,
    error: quoteError,
  } = useFlaunchQuote({
    flaunchToken: FLAUNCH_TOKEN, // use Together token in production
    amount: debouncedAmount,
    side,
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const outputTokenSymbol = side === 'buy' ? 'QUESTION' : 'ETH';
  const inputTokenSymbol = side === 'buy' ? 'ETH' : 'QUESTION';

  let quoteDisplay: string | React.ReactElement = '0.00';
  if (isQuoteLoading || isQuoteFetching) {
    quoteDisplay = <span className="text-sm text-gray-400">Fetching quote...</span>;
  } else if (isQuoteError) {
    quoteDisplay = (
      <span className="text-sm text-red-500">
        {quoteError?.message || 'Error fetching quote'}
      </span>
    );
  } else if (quotedAmount) {
    // Attempt to format the number to a reasonable number of decimal places
    const num = parseFloat(quotedAmount);
    quoteDisplay = isNaN(num) ? '0.00' : num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6});
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
        {/* Buy/Sell Toggle */}
        <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => {
              setSide('buy');
            }}
            className={`w-1/2 py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${side === 'buy' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-600'}`}
          >
            Buy
          </button>
          <button
            onClick={() => {
              setSide('sell');
            }}
            className={`w-1/2 py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${side === 'sell' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-600'}`}
          >
            Sell
          </button>
        </div>

        {/* Amount Label and Input */}
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            You pay
          </label>
          <div className="relative">
            <input
              type="text" // Changed to text to allow custom regex validation
              inputMode="decimal" // Better for mobile keyboards
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder={`0.00 ${inputTokenSymbol}`}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {inputTokenSymbol}
            </span>
          </div>
        </div>

        {/* Pay/Receive Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm text-gray-300 mb-1">
            <span>You receive (estimated)</span>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg text-right min-h-[50px] flex items-center justify-end">
            <span className="text-lg font-medium text-white">
              {quoteDisplay} {outputTokenSymbol}
            </span>
          </div>
        </div>
        
        {/* Trade Button */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={isQuoteLoading || isQuoteFetching || isQuoteError || !quotedAmount || parseFloat(quotedAmount) <= 0 || !amount || parseFloat(amount) <= 0}
        >
          {(isQuoteLoading || isQuoteFetching) ? 'Getting Quote...' : 'Trade'}
        </button>
      </div>
    </div>
  );
};

export default SwapInterface; 