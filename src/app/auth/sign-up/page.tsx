"use client"

import { useState, useContext } from "react"
import styles from "./sign-up.module.css"
import { AuthContext } from "@/app/provider/auth-provider"

export default function SignUpPage() {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const { signup } = useContext(AuthContext) || {}

  const handleSignUp = () => {
    if (username && password) {
      if (signup) signup(username, password)
    } else {
      alert("Please fill all fields")
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign Up</h1>
      <input
        type="text"
        className={styles.input}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className={styles.input}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={styles.button} onClick={handleSignUp}>
        Sign Up
      </button>
    </div>
  )
}
