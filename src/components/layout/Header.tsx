'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ConnectKitButton } from 'connectkit'
import logo from '@/assets/images/logo.svg'

export function Header() {
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
            <ConnectKitButton />
          </div>
        </div>
      </div>
    </header>
  )
}
