export type RepairStatus = 'recu' | 'diagnostic' | 'en_attente' | 'en_reparation' | 'pret' | 'livre'

export interface CustomerInfo {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface RepairService {
  id: string
  name: string
  description: string
  price: number
  estimatedTime: number // in hours
  category: 'screen' | 'battery' | 'camera' | 'other'
  isAvailable: boolean
}

export interface RepairOrder {
  id: string
  customerId: string
  customer: CustomerInfo
  phoneModel: string
  serialNumber?: string
  services: RepairService[]
  status: RepairStatus
  totalPrice: number
  estimatedCompletion: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface PhoneModel {
  id: string
  brand: string
  model: string
  year: number
  isSupported: boolean
  imageUrl: string
  basePrice: number
}

export interface RepairQuote {
  phoneModel: string
  services: RepairService[]
  totalPrice: number
  estimatedTime: number
  warranty: number // in months
} 