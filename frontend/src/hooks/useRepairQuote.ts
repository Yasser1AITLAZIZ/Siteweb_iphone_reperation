import { useState, useMemo } from 'react'
import type { RepairService, PhoneModel, RepairQuote } from '../types'

interface UseRepairQuoteProps {
  phoneModel?: PhoneModel
  selectedServices: RepairService[]
}

export function useRepairQuote({ phoneModel, selectedServices }: UseRepairQuoteProps) {
  const [isCalculating, setIsCalculating] = useState(false)

  const quote = useMemo((): RepairQuote | null => {
    if (!phoneModel || selectedServices.length === 0) {
      return null
    }

    const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)
    const estimatedTime = selectedServices.reduce((sum, service) => sum + service.estimatedTime, 0)
    
    // Base warranty is 3 months, increases with service count
    const warranty = Math.min(3 + Math.floor(selectedServices.length * 0.5), 12)

    return {
      phoneModel: phoneModel.model,
      services: selectedServices,
      totalPrice,
      estimatedTime,
      warranty
    }
  }, [phoneModel, selectedServices])

  const calculateQuote = async () => {
    setIsCalculating(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsCalculating(false)
    return quote
  }

  return {
    quote,
    isCalculating,
    calculateQuote,
    hasValidSelection: !!phoneModel && selectedServices.length > 0
  }
} 