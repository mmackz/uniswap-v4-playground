export const QUOTER_V4_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'Currency', name: 'exactCurrency', type: 'address' },
          {
            components: [
              {
                internalType: 'Currency',
                name: 'intermediateCurrency',
                type: 'address',
              },
              { internalType: 'uint24', name: 'fee', type: 'uint24' },
              { internalType: 'int24', name: 'tickSpacing', type: 'int24' },
              {
                internalType: 'contract IHooks',
                name: 'hooks',
                type: 'address',
              },
              { internalType: 'bytes', name: 'hookData', type: 'bytes' },
            ],
            internalType: 'struct PathKey[]',
            name: 'path',
            type: 'tuple[]',
          },
          { internalType: 'uint128', name: 'exactAmount', type: 'uint128' },
        ],
        internalType: 'struct IV4Quoter.QuoteExactParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactInput',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export const V4_EXECUTE_ABI = [
  {
    name: 'execute',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { internalType: 'bytes', name: 'commands', type: 'bytes' },
      { internalType: 'bytes[]', name: 'inputs', type: 'bytes[]' },
    ],
    outputs: [],
  },
] as const

// ABI parameter definitions for EXACT_INPUT
export const EXACT_INPUT_PARAMS = [
  { type: 'address', name: 'currencyIn' },
  {
    type: 'tuple[]',
    name: 'path',
    components: [
      { type: 'address', name: 'intermediateCurrency' },
      { type: 'uint24', name: 'fee' },
      { type: 'int24', name: 'tickSpacing' },
      { type: 'address', name: 'hooks' },
      { type: 'bytes', name: 'hookData' },
    ],
  },
  { type: 'uint128', name: 'amountIn' },
  { type: 'uint128', name: 'amountOutMinimum' },
] as const

// ABI parameter definitions for SETTLE_ALL
export const SETTLE_ALL_PARAMS = [
  { name: 'currency', type: 'address' },
  { name: 'amount',   type: 'uint256' },
] as const

// ABI parameter definitions for TAKE_ALL
export const TAKE_ALL_PARAMS = [
  { name: 'currencyOut',       type: 'address' },
  { name: 'amountOutMinimum', type: 'uint256' },
] as const

// ABI parameter definitions for SWEEP
export const SWEEP_PARAMS = [
  { name: 'token',     type: 'address' },
  { name: 'recipient', type: 'address' },
  { name: 'minAmount', type: 'uint256' },
] as const
