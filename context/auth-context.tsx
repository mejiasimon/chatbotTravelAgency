"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user types
export type UserRole = "regular" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Sample users for simulation
const SAMPLE_USERS = [
  {
    id: "1",
    name: "Usuario Regular",
    email: "usuario@example.com",
    password: "password123",
    role: "regular" as UserRole,
  },
  {
    id: "2",
    name: "Administrador",
    email: "admin@exploracolombia.com",
    password: "admin123",
    role: "admin" as UserRole,
  },
]

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("exploraUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Simulated login function
  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = SAMPLE_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("exploraUser", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("exploraUser")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
