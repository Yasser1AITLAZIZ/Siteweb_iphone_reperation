import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Types
interface User {
  id: string
  email: string
  name: string
  phone: string
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  type: 'repair' | 'product'
  description: string
}

interface AuthContextType {
  user: User | null
  cart: CartItem[]
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, phone: string) => Promise<void>
  logout: () => void
  addToCart: (item: Omit<CartItem, 'id'>) => void
  removeFromCart: (itemId: string) => void
  updateCartQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

// Mock data
const mockUsers = [
  {
    id: '1',
    email: 'demo@irepair-pro.ma',
    password: 'demo123',
    name: 'Ahmed Benali',
    phone: '+212 6 12 34 56 78'
  }
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load user and cart from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('irepair_user')
    const savedCart = localStorage.getItem('irepair_cart')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save user and cart to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('irepair_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('irepair_user')
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('irepair_cart', JSON.stringify(cart))
  }, [cart])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
    } else {
      throw new Error('Email ou mot de passe incorrect')
    }
    
    setIsLoading(false)
  }

  const signup = async (email: string, password: string, name: string, phone: string) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('Un compte avec cet email existe déjà')
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      phone
    }
    
    setUser(newUser)
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    setCart([])
  }

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: Date.now().toString()
    }
    
    setCart(prev => [...prev, newItem])
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value: AuthContextType = {
    user,
    cart,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
