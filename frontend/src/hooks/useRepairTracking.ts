import { useState, useEffect, useCallback } from 'react'
import type { RepairOrder, RepairStatus } from '../types'

interface UseRepairTrackingProps {
  orderId?: string
  autoPoll?: boolean
  pollInterval?: number
}

export function useRepairTracking({ 
  orderId, 
  autoPoll = true, 
  pollInterval = 30000 
}: UseRepairTrackingProps = {}) {
  const [order, setOrder] = useState<RepairOrder | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  const mockOrders: RepairOrder[] = [
    {
      id: '1',
      customerId: 'cust-1',
      customer: {
        id: 'cust-1',
        firstName: 'Ahmed',
        lastName: 'Benali',
        email: 'ahmed@example.com',
        phone: '+212 6 12 34 56 78',
        address: {
          street: '123 Rue Hassan II',
          city: 'Casablanca',
          postalCode: '20000',
          country: 'Maroc'
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      phoneModel: 'iPhone 13 Pro',
      services: [
        {
          id: 'screen-1',
          name: 'Remplacement écran',
          description: 'Écran OLED complet avec vitre',
          price: 1490,
          estimatedTime: 2,
          category: 'screen',
          isAvailable: true
        }
      ],
      status: 'en_reparation',
      totalPrice: 1490,
      estimatedCompletion: new Date('2024-01-15'),
      notes: 'Écran cassé, remplacement complet nécessaire',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12')
    }
  ]

  const fetchOrder = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const foundOrder = mockOrders.find(o => o.id === id)
      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        setError('Commande non trouvée')
      }
    } catch (err) {
      setError('Erreur lors de la récupération de la commande')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (newStatus: RepairStatus) => {
    if (!order) return false
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setOrder(prev => prev ? {
        ...prev,
        status: newStatus,
        updatedAt: new Date()
      } : null)
      
      return true
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut')
      return false
    } finally {
      setLoading(false)
    }
  }, [order])

  useEffect(() => {
    if (!orderId) return

    fetchOrder(orderId)

    if (autoPoll) {
      const interval = setInterval(() => {
        fetchOrder(orderId)
      }, pollInterval)

      return () => clearInterval(interval)
    }
  }, [orderId, autoPoll, pollInterval, fetchOrder])

  return {
    order,
    loading,
    error,
    fetchOrder,
    updateStatus,
    refresh: () => orderId && fetchOrder(orderId)
  }
} 