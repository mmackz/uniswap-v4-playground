import { useQuery } from '@tanstack/react-query'
import {
  createPublicClient,
  http,
  formatUnits,
  parseUnits,
  zeroAddress,
  zeroHash,
  Address,
} from 'viem'
import { base } from 'viem/chains'
import { QUOTER_V4_ABI } from '@/utils/abi'

const flETH_ADDRESS = '0x000000000d564d5be76f7f0d28fe52605afc7cf8' as const
const flETH_Hooks = '0x9E433F32bb5481a9CA7DFF5b3af74A7ed041a888' as const // for hook
const positionManagerAddress =
  '0xF785bb58059FAB6fb19bDdA2CB9078d9E546Efdc' as const // for hook

const QUOTER_ADDRESS = '0x0d5e0f971ed27fbff6c2837bf31316121532048d'

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL!),
})

const fetchQuote = async (
  flaunchToken: Address,
  amount: string,
  side: 'buy' | 'sell',
): Promise<string> => {
  if (!amount || parseFloat(amount) <= 0) {
    return '0'
  }
  const exactAmountParsed = parseUnits(amount, 18) // all flaunch tokens have 18 decimals

  let params

  if (side === 'buy') {
    // Buy QUESTION (ETH -> QUESTION)
    params = {
      exactCurrency: zeroAddress,
      path: [
        {
          intermediateCurrency: flETH_ADDRESS,
          fee: 0,
          tickSpacing: 60,
          hooks: flETH_Hooks,
          hookData: zeroHash,
        },
        {
          intermediateCurrency: flaunchToken,
          fee: 0,
          tickSpacing: 60,
          hooks: positionManagerAddress,
          hookData: zeroHash,
        },
      ],
      exactAmount: exactAmountParsed,
    }
  } else {
    // Sell QUESTION (QUESTION -> ETH)
    params = {
      exactCurrency: flaunchToken,
      path: [
        {
          intermediateCurrency: flETH_ADDRESS,
          fee: 0,
          tickSpacing: 60,
          hooks: positionManagerAddress,
          hookData: zeroHash,
        },
        {
          intermediateCurrency: zeroAddress,
          fee: 0,
          tickSpacing: 60,
          hooks: flETH_Hooks,
          hookData: zeroHash,
        },
      ],
      exactAmount: exactAmountParsed,
    }
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
  flaunchToken: Address
  amount: string
  side: 'buy' | 'sell'
}

export const useFlaunchQuote = ({
  flaunchToken,
  amount,
  side,
}: UseFlaunchQuoteParams) => {
  return useQuery<string, Error>({
    queryKey: ['flaunchQuote', flaunchToken, amount, side],
    queryFn: () => fetchQuote(flaunchToken, amount, side),
    enabled: !!amount && parseFloat(amount) > 0,
    staleTime: 5000, // Cache quote for 5 seconds
    refetchInterval: 5000, // Refetch every 5 seconds
    placeholderData: (previousData) => previousData ?? '0' 
  })
}
