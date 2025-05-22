'use client'

import { Web3Provider } from './providers/web3provider'
import { type ReactNode } from 'react'
import { type State } from 'wagmi'

export function Providers({
  children,
}: {
  children: ReactNode
  initialState?: State
}) {

  return (
    <Web3Provider>
      {children}
    </Web3Provider>
  )
}
