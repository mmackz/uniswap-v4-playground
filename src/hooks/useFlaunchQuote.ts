import { useQuery } from '@tanstack/react-query'
import {
  createPublicClient,
  http,
  formatUnits,
  parseUnits,
  Address,
} from 'viem'
import { base } from 'viem/chains'
import { QUOTER_V4_ABI } from '@/utils/abi'
import {
  QUOTER_ADDRESS,
} from '@/utils/constants'
import { buildPath } from '@/utils/uniswap'

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL!),
})

const fetchQuote = async (
  currencyIn: Address,
  currencyOut: Address,
  amount: string
): Promise<string> => {
  if (!amount || parseFloat(amount) <= 0) {
    return '0'
  }
  const exactAmountParsed = parseUnits(amount, 18) // all flaunch tokens have 18 decimals

  const params = {
    exactCurrency: currencyIn,
    path: buildPath(currencyOut),
    exactAmount: exactAmountParsed,
  }

  try {
    const { result } = await publicClient.simulateContract({
      address: QUOTER_ADDRESS,
      abi: QUOTER_V4_ABI,
      functionName: 'quoteExactInput',
      args: [params],
    })

    const [amountOut, gasEstimate] = result as [bigint, bigint]
    console.log('gasEstimate', gasEstimate)
    console.log('amountOut', amountOut)

    // Subtract 0.5% for slippage (need to pass in value and update if we want it to be dynamic)
    const slippageAdjustedAmount = amountOut - (amountOut * 5n) / 100n // 0.5% slippage (flaunch default)

    return formatUnits(slippageAdjustedAmount, 18)
  } catch (error) {
    console.error('Error fetching quote:', error)
    if (error instanceof Error) {
      throw new Error(`Quote failed: ${error.message}`)
    }
    throw new Error('Unknown error fetching quote.')
  }
}

interface UseFlaunchQuoteParams {
  currencyIn: Address
  currencyOut: Address
  amount: string
}

export const useFlaunchQuote = ({
  currencyIn,
  currencyOut,
  amount,
}: UseFlaunchQuoteParams) => {
  return useQuery<string, Error>({
    queryKey: ['flaunchQuote', currencyIn, currencyOut, amount],
    queryFn: () => fetchQuote(currencyIn, currencyOut, amount),
    enabled: !!amount && parseFloat(amount) > 0,
    staleTime: 5000, // Cache quote for 5 seconds
    refetchInterval: 5000, // Refetch every 5 seconds
    placeholderData: (previousData) => previousData ?? '0',
  })
}
