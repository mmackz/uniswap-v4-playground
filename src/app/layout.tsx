import '@/styles/globals.css'
import { type ReactNode } from 'react'
import { Web3Provider } from './providers/web3provider'
import { Header } from '@/components/layout/Header'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <Header />
          <main className="pt-16">{children}</main>
        </Web3Provider>
      </body>
    </html>
  )
}
