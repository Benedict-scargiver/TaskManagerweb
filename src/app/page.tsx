"use client"

import { useEffect, useState, useContext } from "react"
import styles from "./page.module.css"
import { AuthContext } from "./provider/auth-provider"
import Link from "next/link"
import { toast } from "react-hot-toast"

interface Task {
  id: string
  name: string
  dueDate: string
  done: boolean
}

export default function HomePage() {
  const { isAuthenticated, logout } = useContext(AuthContext) || {}
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const loadTasks = () => {
      const data = localStorage.getItem("tasks")
      if (data) {
        setTasks(JSON.parse(data))
      } else {
        setTasks([])
      }
    }
    loadTasks()
  }, [])

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    setTasks(updatedTasks)
  }

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    )
    saveTasks(updatedTasks)
    const task = tasks.find((t) => t.id === id)
    if (task && !task.done) {
      toast.success(`Task "${task.name}" completed!`)
    }
  }

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering toggleTask
    const task = tasks.find((t) => t.id === id)
    const updatedTasks = tasks.filter((task) => task.id !== id)
    saveTasks(updatedTasks)
    toast.success(`Task "${task?.name}" deleted!`)
  }

  if (!isAuthenticated) return null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Tasks</h1>
        <button className={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={styles.task}
            onClick={() => toggleTask(task.id)}
          >
            <span className={task.done ? styles.completed : ""}>
              {task.name} (Due: {task.dueDate})
            </span>
            <button
              className={styles.deleteButton}
              onClick={(e) => deleteTask(task.id, e)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <Link href="/add-task" className={styles.addButton}>
        Add New Task
      </Link>
    </div>
  )
}
