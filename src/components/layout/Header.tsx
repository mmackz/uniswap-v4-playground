'use client'

import Link from 'next/link'
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useAccount } from 'wagmi';
import { truncateEthAddress } from '@/utils/address';

export function Header() {
  const { open } = useAppKit();
  const { address } = useAppKitAccount();
  const { isConnected } = useAccount();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">My App</span>
            </Link>
          </div>
          <div className="flex items-center">
            <button onClick={() => open()}>{isConnected ? truncateEthAddress(address ?? '') : 'Connect'}</button>
          </div>
        </div>
      </div>
    </header>
  )
}
