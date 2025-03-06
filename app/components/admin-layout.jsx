"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Settings, History, FileText, LogOut, ShoppingBag } from "lucide-react"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Content Generator</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <Link href="/" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                <Home className="w-5 h-5 mr-3" />
                Home
              </Link>
            </li>
            <li>
              <Link href="/admin" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                <Settings className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/prompts" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                <Settings className="w-5 h-5 mr-3" />
                Google Prompt Templates
              </Link>
            </li>
            <li>
              <Link
                href="/admin/amazon-prompts"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-5 h-5 mr-3" />
                Amazon Prompt Templates
              </Link>
            </li>
            <li>
              <Link href="/all-content" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                <History className="w-5 h-5 mr-3" />
                All Content History
              </Link>
            </li>
            <li>
              <Link href="/google-content" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                <FileText className="w-5 h-5 mr-3" />
                Google Content Generator
              </Link>
            </li>
            <li>
              <Link href="/amazon-review" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                <ShoppingBag className="w-5 h-5 mr-3" />
                Amazon Review Generator
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <Button variant="outline" className="w-full flex items-center justify-center" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  )
}

