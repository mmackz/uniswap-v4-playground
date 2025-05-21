'use client'

import { ConnectKitProvider } from 'connectkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'

import { getConfig } from '../wagmi'
import { connectKitTheme } from '@/styles/theme/connectkit'

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: State
}) {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider customTheme={connectKitTheme}>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
