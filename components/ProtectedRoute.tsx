"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "operador"
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return null // AuthGuard já cuida disso
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return (
      fallback || (
        <Alert className="m-4">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar esta funcionalidade.
            {requiredRole === "admin" && " Apenas administradores podem realizar esta ação."}
          </AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
