"use client"

import { useEffect, useState } from "react"
import { Button } from "antd"
import { MoonOutlined, SunOutlined } from "@ant-design/icons"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <Button
      onClick={toggleTheme}
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      style={{ background: "transparent" }}
    >
      <span style={{ marginLeft: 4 }}>{isDark ? "Light" : "Dark"}</span>
    </Button>
  )
}
