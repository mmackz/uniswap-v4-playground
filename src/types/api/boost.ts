export interface BoostsResponse {
  boosts: Boost[]
  totalBoosts: number
}

export interface Boost {
  id: string
  action: string
  allowList: AllowList
  boostIndex: string
  budget?: string
  incentiveCount: string
  owner: string
  validator: string
  blockTimestamp: string
  txHash?: string
  chainId: number
  actionSteps: ActionStep[]
  incentives: Incentive[]
  protocolFee?: string
  referralFee?: string
  maxParticipants: string
  createdAtChainBlockNumbers: Record<string, string>
}

export interface AllowList {
  owner: string
  contractAddress: string
  type: 'SimpleAllowList' | 'SimpleDenyList'
  addresses: string[] | null
}

export interface ActionStep {
  chainId: number
  claimant: string
  signature: string
  signatureName: string
  signatureType: 'event' | 'function'
  actionType: number
  targetContract: string
  parameters: ActionParameters
}

export interface ActionParameters {
  filterType: number
  fieldType: number
  fieldIndex: number
  filterData: string
}

export type Incentive = ERC20Incentive | ERC20VariableCriteriaIncentive

export interface ERC20Incentive {
  type: 'ERC20Incentive'
  asset: string
  strategy: number
  reward: string
  limit: string
  totalClaims?: string
}

export interface ERC20VariableCriteriaIncentive {
  type: 'ERC20VariableCriteriaIncentive'
  asset: string
  reward: string
  limit: string
  maxReward: string
  criteria: {
    criteriaType: number
    signature: string
    fieldIndex: number
    targetContract: string
  }
  totalAmountClaimed?: string
  totalClaims?: string
}
