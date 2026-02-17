import { createContext } from 'react'
import type { BrandConfig } from '@/components/brand/brand.types'
import { brandConfig } from '@/components/brand/brand.config'

export const BrandContext = createContext<BrandConfig>(brandConfig)

export function BrandProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value?: BrandConfig
}) {
  return (
    <BrandContext.Provider value={value ?? brandConfig}>
      {children}
    </BrandContext.Provider>
  )
}
