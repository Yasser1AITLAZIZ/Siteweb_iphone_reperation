import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PhoneModel, RepairService, RepairOrder, RepairStatus } from '../types'

interface RepairState {
  // State
  selectedModel: PhoneModel | null
  selectedServices: RepairService[]
  orders: RepairOrder[]
  loading: boolean
  error: string | null

  // Actions
  setModel: (model: PhoneModel | null) => void
  toggleService: (service: RepairService) => void
  clearSelection: () => void
  computeTotal: () => number
  createOrder: (customerInfo: any) => Promise<RepairOrder | null>
  updateStatus: (orderId: string, status: RepairStatus) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useRepairStore = create<RepairState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedModel: null,
      selectedServices: [],
      orders: [],
      loading: false,
      error: null,

      // Actions
      setModel: (model) => {
        set({ selectedModel: model, selectedServices: [] })
      },

      toggleService: (service) => {
        const { selectedServices } = get()
        const isSelected = selectedServices.some(s => s.id === service.id)
        
        if (isSelected) {
          set({
            selectedServices: selectedServices.filter(s => s.id !== service.id)
          })
        } else {
          set({
            selectedServices: [...selectedServices, service]
          })
        }
      },

      clearSelection: () => {
        set({ selectedModel: null, selectedServices: [] })
      },

      computeTotal: () => {
        const { selectedServices } = get()
        return selectedServices.reduce((sum, service) => sum + service.price, 0)
      },

      createOrder: async (customerInfo) => {
        const { selectedModel, selectedServices, computeTotal } = get()
        
        if (!selectedModel || selectedServices.length === 0) {
          return null
        }

        set({ loading: true, error: null })

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))

          const newOrder: RepairOrder = {
            id: `order-${Date.now()}`,
            customerId: customerInfo.id || 'temp-id',
            customer: customerInfo,
            phoneModel: selectedModel.model,
            services: selectedServices,
            status: 'recu',
            totalPrice: computeTotal(),
            estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            createdAt: new Date(),
            updatedAt: new Date()
          }

          set(state => ({
            orders: [...state.orders, newOrder],
            loading: false
          }))

          return newOrder
        } catch (error) {
          set({ 
            error: 'Erreur lors de la création de la commande',
            loading: false 
          })
          return null
        }
      },

      updateStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date() }
              : order
          )
        }))
      },

      setLoading: (loading) => {
        set({ loading })
      },

      setError: (error) => {
        set({ error })
      }
    }),
    {
      name: 'repair-store',
      partialize: (state) => ({
        orders: state.orders
      })
    }
  )
) 