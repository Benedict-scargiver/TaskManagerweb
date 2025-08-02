import { ReactNode } from "react"
import AuthCheck from "./auth-check"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthCheck>{children}</AuthCheck>
}
