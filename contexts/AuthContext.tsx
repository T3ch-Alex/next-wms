"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthContextType } from "@/types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database - Em produção, isso viria de uma API
const mockUsers: Array<User & { password: string }> = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@wms.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "João Operador",
    email: "operador@wms.com",
    password: "op123",
    role: "operador",
    createdAt: new Date("2024-01-15"),
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("wms-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Erro ao carregar usuário salvo:", error)
        localStorage.removeItem("wms-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("wms-user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "admin" | "operador",
  ): Promise<boolean> => {
    setIsLoading(true)

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar se email já existe
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Criar novo usuário
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
      createdAt: new Date(),
    }

    mockUsers.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("wms-user", JSON.stringify(userWithoutPassword))

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("wms-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
