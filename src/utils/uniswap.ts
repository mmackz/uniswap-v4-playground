import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  Hex,
  zeroAddress,
  zeroHash,
} from 'viem'
import {
  EXACT_INPUT_PARAMS,
  SETTLE_ALL_PARAMS,
  SWEEP_PARAMS,
  TAKE_ALL_PARAMS,
  V4_EXECUTE_ABI,
} from './abi'
import {
  ACTIONS,
  COMMAND_V4_SWAP,
  COMMAND_V4_SWAP_AND_SWEEP,
  flETH,
  flETH_Hooks,
  positionManager,
} from './constants'

interface Path {
  intermediateCurrency: Address
  fee: number
  tickSpacing: number
  hooks: Address
  hookData: Hex
}

function buildSwapInput(
  currencyIn: Address,
  currencyOut: Address,
  path: Array<Path>,
  amountIn: bigint,
  amountOutMin: bigint
) {
  const swapParams = encodeAbiParameters(
    [{ type: 'tuple', components: EXACT_INPUT_PARAMS }],
    [{ currencyIn, path, amountIn, amountOutMinimum: amountOutMin }]
  )
  const settleParams = encodeAbiParameters(SETTLE_ALL_PARAMS, [
    currencyIn,
    amountIn,
  ])
  const takeParams = encodeAbiParameters(TAKE_ALL_PARAMS, [
    currencyOut,
    amountOutMin,
  ])
  return encodeAbiParameters(
    [
      { type: 'bytes', name: 'commands' },
      { type: 'bytes[]', name: 'inputs' },
    ],
    [ACTIONS, [swapParams, settleParams, takeParams]]
  )
}

function buildSweepInput(recipient: Address) {
  return encodeAbiParameters(SWEEP_PARAMS, [zeroAddress, recipient, 0n])
}

function buildPath(currencyOut: Address) {
  return [
    {
      intermediateCurrency: flETH,
      fee: 0,
      tickSpacing: 60,
      hooks: currencyOut === zeroAddress ? positionManager : flETH_Hooks,
      hookData: zeroHash,
    },
    {
      intermediateCurrency: currencyOut,
      fee: 0,
      tickSpacing: 60,
      hooks: currencyOut === zeroAddress ? flETH_Hooks : positionManager,
      hookData: zeroHash,
    },
  ]
}

export function encodeExecuteCallData(
  currencyIn: Address,
  currencyOut: Address,
  amountIn: bigint,
  amountOutMin: bigint
) {
  const path = buildPath(currencyOut)
  const swapInput = buildSwapInput(
    currencyIn,
    currencyOut,
    path,
    amountIn,
    amountOutMin
  )
  const sweepInput = buildSweepInput(currencyOut)
  const commands =
    currencyOut === zeroAddress ? COMMAND_V4_SWAP : COMMAND_V4_SWAP_AND_SWEEP
  const inputs =
    currencyOut === zeroAddress ? [swapInput] : [swapInput, sweepInput]

  return encodeFunctionData({
    abi: V4_EXECUTE_ABI,
    functionName: 'execute',
    args: [commands, inputs],
  })
}
