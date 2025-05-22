import { useMutation } from '@tanstack/react-query'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { zeroAddress, type Address } from 'viem'
import { encodeExecuteArgs } from '../utils/uniswap'
import { UNIVERSAL_ROUTER } from '../utils/constants'
import { V4_EXECUTE_ABI } from '../utils/abi'

interface UseExecuteSwapArgs {
  currencyIn: Address | undefined
  currencyOut: Address | undefined
  amountIn: bigint | undefined
  amountOutMin: bigint | undefined
}

export function useFlaunchSwap({
  currencyIn,
  currencyOut,
  amountIn,
  amountOutMin,
}: UseExecuteSwapArgs) {
  const { writeContractAsync } = useWriteContract()
  
  const mutation = useMutation({
    mutationFn: async () => {
      if (!currencyIn || !currencyOut || !amountIn || !amountOutMin) {
        throw new Error('Missing required swap parameters')
      }

      const args = encodeExecuteArgs(
        currencyIn,
        currencyOut,
        amountIn,
        amountOutMin
      )

      const value = currencyIn === zeroAddress ? amountIn : 0n

      return writeContractAsync({
        address: UNIVERSAL_ROUTER,
        abi: V4_EXECUTE_ABI,
        functionName: 'execute',
        args,
        value,
      })
    }
  })

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: mutation.data,
  })

  return {
    executeSwap: mutation.mutate,
    isPending: mutation.isPending,
    isLoading: isConfirming,
    isSuccess,
    transactionHash: mutation.data,
  }
}
