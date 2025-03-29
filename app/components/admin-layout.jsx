"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { History, FileText, LogOut, ShoppingBag, LayoutDashboard, FileCode } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedIcon } from "./animated-icon"
// import { AnimatedIcon } from "@/components/animated-icon"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    // Check authentication from localStorage
    const auth = localStorage.getItem("auth")
    if (auth) {
      try {
        const authData = JSON.parse(auth)
        if (authData.isLoggedIn) {
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.error("Error parsing auth data:", error)
      }
    }

    // Not authenticated
    setIsAuthenticated(false)
    setIsLoading(false)
    router.push("/admin/login")
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("auth")
    setIsAuthenticated(false)
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-blue-500 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      animation: "pulse",
    },
    {
      id: "dashboard-alt", // Added unique id
      name: "Dashboard", // Added name
      icon: LayoutDashboard,
      href: "/admin",
      animation: "pulse",
    },
    {
      id: "google-prompts",
      name: "Google Prompts",
      icon: FileCode,
      href: "/admin/prompts",
      animation: "float",
    },
    {
      id: "amazon-prompts",
      name: "Amazon Prompts",
      icon: FileCode,
      href: "/admin/amazon-prompts",
      animation: "bounce",
    },
    {
      id: "content-history",
      name: "Content History",
      icon: History,
      href: "/all-content",
      animation: "spin",
    },
    {
      id: "google-generator",
      name: "Google Generator",
      icon: FileText,
      href: "/google-content",
      animation: "wave",
    },
    {
      id: "amazon-generator",
      name: "Amazon Generator",
      icon: ShoppingBag,
      href: "/amazon-review",
      animation: "blink",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Animated sidebar */}
      <motion.div
        className="bg-gray-900/80 backdrop-blur-lg border-r border-gray-800 shadow-xl"
        initial={{ width: isCollapsed ? 80 : 280 }}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1
                className="text-xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-blue-500">Admin</span> Dashboard
              </motion.h1>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            )}
          </motion.button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <motion.li key={item.id} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                    activeMenu === item.id
                      ? "bg-primary/20 text-primary border-l-4 border-primary"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                  onClick={() => setActiveMenu(item.id)}
                >
                  <AnimatedIcon
                    icon={item.icon}
                    className="flex-shrink-0"
                    size={20}
                    animation={activeMenu === item.id ? item.animation : null}
                  />

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        className="ml-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className={`absolute bottom-0 w-full p-6 ${isCollapsed ? "flex justify-center" : ""}`}>
          <Button
            variant="destructive"
            className={`${isCollapsed ? "w-12 h-12 p-0" : "w-full"} flex items-center justify-center`}
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="ml-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto bg-gray-950 relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="futuristic-grid absolute inset-0"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
