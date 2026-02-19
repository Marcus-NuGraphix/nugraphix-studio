import { useContext } from 'react'
import { BrandContext } from '@/components/brand/brand-provider'

export const useBrand = () => useContext(BrandContext)
