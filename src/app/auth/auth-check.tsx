"use client"

import { ReactNode, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthContext } from "../provider/auth-provider"

export default function AuthCheck({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext) || {}
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}
