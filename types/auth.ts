export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "operador"
  createdAt: Date
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: "admin" | "operador") => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: "admin" | "operador"
}
