import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          role: 'customer' | 'technician' | 'admin'
          status: 'active' | 'inactive' | 'suspended'
          address: any | null
          permissions: string[]
          preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          role?: 'customer' | 'technician' | 'admin'
          status?: 'active' | 'inactive' | 'suspended'
          address?: any | null
          permissions?: string[]
          preferences?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: 'customer' | 'technician' | 'admin'
          status?: 'active' | 'inactive' | 'suspended'
          address?: any | null
          permissions?: string[]
          preferences?: any
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          phone_model: string
          serial_number: string | null
          services: any
          notes: string | null
          customer_address: any | null
          status: 'recu' | 'diagnostic' | 'en_attente' | 'en_reparation' | 'pret' | 'livre' | 'annule'
          total_price: number
          estimated_completion: string | null
          tracking_id: string
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          phone_model: string
          serial_number?: string | null
          services: any
          notes?: string | null
          customer_address?: any | null
          status?: 'recu' | 'diagnostic' | 'en_attente' | 'en_reparation' | 'pret' | 'livre' | 'annule'
          total_price: number
          estimated_completion?: string | null
          tracking_id?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          phone_model?: string
          serial_number?: string | null
          services?: any
          notes?: string | null
          customer_address?: any | null
          status?: 'recu' | 'diagnostic' | 'en_attente' | 'en_reparation' | 'pret' | 'livre' | 'annule'
          total_price?: number
          estimated_completion?: string | null
          tracking_id?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      quotes: {
        Row: {
          id: string
          customer_id: string
          phone_model: string
          services: any
          total_price: number
          status: 'pending' | 'accepted' | 'rejected' | 'expired'
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          phone_model: string
          services: any
          total_price: number
          status?: 'pending' | 'accepted' | 'rejected' | 'expired'
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          phone_model?: string
          services?: any
          total_price?: number
          status?: 'pending' | 'accepted' | 'rejected' | 'expired'
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      phone_models: {
        Row: {
          id: string
          brand: string
          model: string
          year: number
          is_supported: boolean
          image_url: string | null
          base_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand: string
          model: string
          year: number
          is_supported?: boolean
          image_url?: string | null
          base_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand?: string
          model?: string
          year?: number
          is_supported?: boolean
          image_url?: string | null
          base_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      repair_services: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          estimated_time: number
          category: 'screen' | 'battery' | 'camera' | 'audio' | 'connector' | 'other'
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          estimated_time: number
          category: 'screen' | 'battery' | 'camera' | 'audio' | 'connector' | 'other'
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          estimated_time?: number
          category?: 'screen' | 'battery' | 'camera' | 'audio' | 'connector' | 'other'
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
