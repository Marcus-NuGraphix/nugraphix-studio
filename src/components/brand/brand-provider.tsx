import { createContext } from 'react'
import type { ReactNode } from 'react'
import type { BrandConfig } from '@/components/brand/brand.types'
import { brandConfig } from '@/components/brand/brand.config'

export const BrandContext = createContext<BrandConfig>(brandConfig)
BrandContext.displayName = 'BrandContext'

interface BrandProviderProps {
  children: ReactNode
  value?: BrandConfig
}

export function BrandProvider({
  children,
  value,
}: BrandProviderProps) {
  return (
    <BrandContext.Provider value={value ?? brandConfig}>
      {children}
    </BrandContext.Provider>
  )
}
