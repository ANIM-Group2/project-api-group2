'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'admin' | 'production_manager' | 'inventory_manager' | 'logistics_manager' | 'quality_engineer' | 'operator'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (requiredRoles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'admin@aeronexis.com': {
    id: '1',
    name: 'Sarah Chen',
    email: 'admin@aeronexis.com',
    role: 'admin',
    department: 'Executive',
  },
  'production@aeronexis.com': {
    id: '2',
    name: 'Marcus Rivera',
    email: 'production@aeronexis.com',
    role: 'production_manager',
    department: 'Manufacturing',
  },
  'inventory@aeronexis.com': {
    id: '3',
    name: 'Elena Kowalski',
    email: 'inventory@aeronexis.com',
    role: 'inventory_manager',
    department: 'Supply Chain',
  },
  'logistics@aeronexis.com': {
    id: '4',
    name: 'James Okonkwo',
    email: 'logistics@aeronexis.com',
    role: 'logistics_manager',
    department: 'Logistics',
  },
  'quality@aeronexis.com': {
    id: '5',
    name: 'Aiko Tanaka',
    email: 'quality@aeronexis.com',
    role: 'quality_engineer',
    department: 'Quality Assurance',
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUsers['admin@aeronexis.com'])

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Simulated login - in production, this would be an API call
    const foundUser = mockUsers[email.toLowerCase()]
    if (foundUser) {
      setUser(foundUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false
    if (user.role === 'admin') return true
    return requiredRoles.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  production_manager: 'Production Manager',
  inventory_manager: 'Inventory Manager',
  logistics_manager: 'Logistics Manager',
  quality_engineer: 'Quality Engineer',
  operator: 'Operator',
}

export const roleColors: Record<UserRole, string> = {
  admin: 'bg-primary text-primary-foreground',
  production_manager: 'bg-chart-1 text-white',
  inventory_manager: 'bg-chart-2 text-white',
  logistics_manager: 'bg-chart-3 text-black',
  quality_engineer: 'bg-chart-4 text-white',
  operator: 'bg-muted text-muted-foreground',
}
