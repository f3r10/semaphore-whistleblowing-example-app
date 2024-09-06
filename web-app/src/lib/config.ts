import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { injected, metaMask, safe } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia, hardhat],
  connectors: [
    injected(),
    metaMask(),
    safe(),
  ],
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http(),
  },
ssr: true, // If your dApp uses server side rendering (SSR)
})
