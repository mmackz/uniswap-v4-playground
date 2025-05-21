'use client'

import { Web3Provider } from './providers/web3provider'
import { QueryClient } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State } from 'wagmi'

import { getConfig } from '../wagmi'

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
