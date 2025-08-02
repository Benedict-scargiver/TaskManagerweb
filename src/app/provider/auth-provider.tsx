"use client"

import { ReactNode, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createContext } from "react"
import { toast } from "react-hot-toast"
import styles from "./auth-provider.module.css"

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => void
  logout: () => void
  signup: (username: string, password: string) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = () => {
      const session = localStorage.getItem("currentUser")
      const path = window.location.pathname
      if (session) {
        setIsAuthenticated(true)
        if (path.startsWith("/auth")) {
          router.push("/")
        }
      } else {
        setIsAuthenticated(false)
        if (!path.startsWith("/auth")) {
          router.push("/auth/sign-in")
        }
      }
      setLoading(false)
    }
    checkSession()
  }, [router])

  const signup = (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    if (
      users.some((user: { username: string }) => user.username === username)
    ) {
      toast.error("Username already exists")
      return
    }

    users.push({ username, password })
    localStorage.setItem("users", JSON.stringify(users))
    toast.success("Sign up successful! Please login.")
    router.push("/auth/sign-in")
  }

  const login = (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find(
      (u: { username: string; password: string }) =>
        u.username === username && u.password === password
    )

    if (user) {
      localStorage.setItem("currentUser", username)
      setIsAuthenticated(true)
      router.push("/")
    } else {
      toast.error("Invalid credentials")
    }
  }

  const logout = () => {
    localStorage.removeItem("currentUser")
    setIsAuthenticated(false)
    router.push("/auth/sign-in")
  }

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loaderSpinner}></div>
        <span>Checking session...</span>
      </div>
    )
  }
  return (
    <AuthContext.Provider value={{ isAuthenticated, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
