import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { zeroAddress, type Address } from 'viem';
import { encodeExecuteCallData } from '../utils/uniswap';
import { UNIVERSAL_ROUTER } from '../utils/constants';

interface UseExecuteSwapArgs {
  currencyIn: Address | undefined;
  currencyOut: Address | undefined;
  amountIn: bigint | undefined;
  amountOutMin: bigint | undefined;
}

export function useExecuteSwap({
  currencyIn,
  currencyOut,
  amountIn,
  amountOutMin,
}: UseExecuteSwapArgs) {
  // Use wagmi's useSendTransaction hook
  const { data: txHash, isPending, sendTransaction } = useSendTransaction();
  
  // Track transaction status
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Function to execute the swap
  const executeSwap = () => {
    if (!currencyIn || !currencyOut || !amountIn || !amountOutMin) {
      console.error('Missing required swap parameters');
      return;
    }

    // Get encoded calldata from your existing function
    const calldata = encodeExecuteCallData(
      currencyIn,
      currencyOut,
      amountIn,
      amountOutMin
    );

    // Determine if we need to send native currency (ETH)
    const value = currencyIn === zeroAddress ? amountIn : 0n;

    // Send the transaction
    sendTransaction({
      to: UNIVERSAL_ROUTER,
      data: calldata,
      value,
    });
  };

  return {
    executeSwap,
    isPending,
    isLoading,
    isSuccess,
    transactionHash: txHash,
  };
} 