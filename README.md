# Boost Starter Template

Quickly scaffold your Boost project with this starter template.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm, pnpm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mmackz/boost-starter-template.git
   cd boost-starter-template
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Create a `.env` or `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_WC_PROJECT_ID=your_wallet_connect_project_id
   NEXT_PUBLIC_BASE_RPC_URL=your_base_rpc_url
   ```

#### Get WalletConnect Project ID (NEXT_PUBLIC_WC_PROJECT_ID)
Follow this guide:
- https://docs.blockscout.com/setup/configuration-options/walletconnect-project-id-for-contract-read-write

### Configuring RPC Endpoints

By default, the application uses default RPC endpoints in `src/wagmi.ts`. For better performance and reliability, you should configure your own RPC providers.

Recommended RPC providers:
- [Alchemy](https://www.alchemy.com/)
- [Infura](https://www.infura.io/)
- [QuickNode](https://www.quicknode.com/)

After signing up with a provider:
1. Create new API keys for each network
2. Add the RPC URLs to your `.env.local`:
```
NEXT_PUBLIC_BASE_RPC=your_base_rpc_url
```

### Adding New Networks

To add support for a new network, follow these steps:

(In this example, we'll add support for Optimism)

1. Import the network from wagmi/chains in `src/wagmi.ts`:
```typescript
import { base, optimism } from 'wagmi/chains' // Add your new chain here
```

2. Add the chain to the chains array in the config:
```typescript
chains: [base, optimism], // Add your new chain to this array
```

3. Set up an RPC endpoint for the new network: (optional)
   - See instructions above to set up your own RPC provider
```
# Existing RPC URLs
NEXT_PUBLIC_BASE_RPC=your_base_rpc_url

# New network RPC URL
NEXT_PUBLIC_OPTIMISM_RPC=your_optimism_rpc_url
```

4. Add the transport for your new network in the wagmi config:
```typescript
transports: {
  // Existing transports
  [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC ?? ''),
  
  // New network transport
  [optimism.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_RPC ?? ''),
},
```
The complete `wagmi.ts` file should look something like this:
```typescript
import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { base, optimism } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [base, optimism],
    connectors: [
      injected(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC ?? ''),
      [optimism.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_RPC ?? ''),
    },
  })
}
```

Note: Make sure to use the correct chain ID and RPC URL for your network. You can find a list of supported networks in the [wagmi documentation](https://wagmi.sh/react/chains).
