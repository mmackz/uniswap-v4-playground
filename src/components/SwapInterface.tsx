'use client';

import { useState } from 'react';
import { useFlaunchQuote } from '../hooks/useFlaunchQuote';
import useDebounce from '../hooks/useDebounce';
import { useFlaunchSwap } from '../hooks/useFlaunchSwap';
import { parseUnits, zeroAddress } from 'viem';
import { QUESTION } from '@/utils/constants'; // use Together token in production

const SwapInterface = () => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const debouncedAmount = useDebounce(amount, 500); // 500ms debounce delay

  const currencyIn = side === 'buy' ? zeroAddress : QUESTION;
  const currencyOut = side === 'buy' ? QUESTION : zeroAddress;

  const {
    data: quotedAmount,
    isLoading: isQuoteLoading,
    isFetching: isQuoteFetching,
    isError: isQuoteError,
    error: quoteError,
  } = useFlaunchQuote({
    currencyIn,
    currencyOut,
    amount: debouncedAmount,
  });

  // Set up swap execution hook
  const {
    executeSwap,
    isPending,
    isLoading: isSwapLoading,
    isSuccess: isSwapSuccess,
    transactionHash,
  } = useFlaunchSwap({
    currencyIn,
    currencyOut,
    amountIn: amount ? parseUnits(amount, 18) : undefined,
    amountOutMin: quotedAmount ? parseUnits(quotedAmount, 18) : undefined,
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

  if (isQuoteError) {
    quoteDisplay = (
      <span className="text-sm text-red-500">
        {quoteError?.message || 'Error fetching quote'}
      </span>
    );
  } else if (!quotedAmount && (isQuoteLoading || isQuoteFetching)) {
    quoteDisplay = <span className="text-sm text-gray-400">Fetching quote...</span>;
  } else if (quotedAmount) {
    const num = parseFloat(quotedAmount);
    quoteDisplay = isNaN(num) ? '0.00' : num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6});
  }

  // Handle trade button state
  const isTradeDisabled = 
    isQuoteError || 
    !quotedAmount || 
    parseFloat(quotedAmount) <= 0 || 
    !amount || 
    parseFloat(amount) <= 0 ||
    isPending ||
    isSwapLoading;

  // Determine trade button text based on state
  let tradeButtonText = 'Trade';
  if (isPending) tradeButtonText = 'Confirm in Wallet...';
  if (isSwapLoading) tradeButtonText = 'Transaction Pending...';
  if (isSwapSuccess) tradeButtonText = 'Trade Successful!';

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
              {parseFloat(amount) > 0 ? quoteDisplay : '0.00'} {outputTokenSymbol}
            </span>
          </div>
        </div>
        
        {/* Trade Button */}
        <button
          onClick={() => executeSwap()}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={isTradeDisabled}
        >
          {tradeButtonText}
        </button>

        {/* Transaction Status */}
        {isSwapSuccess && transactionHash && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded-lg">
            <p className="text-green-400 text-sm">Transaction successful!</p>
            <a 
              href={`https://basescan.org//tx/${transactionHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 text-xs underline mt-1 block"
            >
              View on Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapInterface; 