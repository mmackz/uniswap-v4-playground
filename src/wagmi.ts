import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [base],
    connectors: [
      injected(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL ?? ''),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
