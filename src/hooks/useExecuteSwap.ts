import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { zeroAddress, type Address } from 'viem'
import { encodeExecuteCallData } from '../utils/uniswap'
import { UNIVERSAL_ROUTER } from '../utils/constants'

interface UseExecuteSwapArgs {
  currencyIn: Address | undefined
  currencyOut: Address | undefined
  amountIn: bigint | undefined
  amountOutMin: bigint | undefined
}

export function useExecuteSwap({
  currencyIn,
  currencyOut,
  amountIn,
  amountOutMin,
}: UseExecuteSwapArgs) {
  const { data: txHash, isPending, sendTransaction } = useSendTransaction()

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const executeSwap = () => {
    if (!currencyIn || !currencyOut || !amountIn || !amountOutMin) {
      console.error('Missing required swap parameters')
      return
    }

    const calldata = encodeExecuteCallData(
      currencyIn,
      currencyOut,
      amountIn,
      amountOutMin
    )

    const value = currencyIn === zeroAddress ? amountIn : 0n

    sendTransaction({
      to: UNIVERSAL_ROUTER,
      data: calldata,
      value,
    })
  }

  return {
    executeSwap,
    isPending,
    isLoading,
    isSuccess,
    transactionHash: txHash,
  }
}
