"use client";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieStorage, createStorage, http } from "@wagmi/core";
import { useEffect, useState } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
// import { siweConfig } from "@/config/siwe";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const metadata = {
  name: "Uniswap V4 Playground",
  description: "Uniswap V4 Playground",
  url: "http://localhost:3000",
  icons: [],
};

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks: [base],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
  },
});

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
  metadata,
  features: {
    analytics: true,
  },
  // siweConfig,
});

const queryClient = new QueryClient();

export function Web3Provider({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies?: string | null;
}) {
  const [mounted, setMounted] = useState(false);
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies || null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{mounted ? children : null}</QueryClientProvider>
    </WagmiProvider>
  );
}
