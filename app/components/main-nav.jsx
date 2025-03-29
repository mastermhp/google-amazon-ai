"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, ShoppingBag, History, Settings, Home, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { AnimatedIcon } from "./animated-icon"

export default function MainNav() {
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
      active: pathname === "/",
      animation: "float",
    },
    {
      name: "Google Content",
      href: "/google-content",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/google-content",
      animation: "pulse",
    },
    {
      name: "Amazon Reviews",
      href: "/amazon-review",
      icon: <ShoppingBag className="mr-2 h-4 w-4" />,
      active: pathname.includes("amazon-review") && !pathname.includes("history"),
      animation: "bounce",
    },
    {
      name: "All History",
      href: "/all-content",
      icon: <History className="mr-2 h-4 w-4" />,
      active: pathname === "/all-content",
      animation: "spin",
    },
    {
      name: "Google History",
      href: "/history",
      icon: <History className="mr-2 h-4 w-4" />,
      active: pathname === "/history" || (pathname.startsWith("/history/") && !pathname.includes("amazon")),
      animation: "wave",
    },
    {
      name: "Amazon History",
      href: "/amazon-review/history",
      icon: <History className="mr-2 h-4 w-4" />,
      active: pathname === "/amazon-review/history" || pathname.startsWith("/amazon-review/history/"),
      animation: "blink",
    },
    {
      name: "Admin",
      href: "/admin",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname.startsWith("/admin"),
      animation: "glitch",
    },
  ]

  return (
    <div className="w-full flex justify-center">
      <nav className="flex items-center space-x-1 overflow-x-auto pb-2">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <motion.div
            className="rounded-full bg-[#542180] p-1 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatedIcon icon={Sparkles} className="h-4 w-6 flex items-center justify-center mx-1 my-2 text-white" animation="pulse" />
          </motion.div>
          <motion.span
            className="hidden font-bold sm:inline-block text-lg"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-[#542180]">AI</span>
            <span className="text-white">Content</span>
          </motion.span>
        </Link>

        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg backdrop-blur-sm">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative"
            >
              <Link href={item.href}>
                <Button
                  variant={item.active ? "neon" : "ghost"}
                  className={cn(
                    "justify-start whitespace-nowrap transition-all duration-200",
                    item.active ? "text-[#542180]/90" : "text-gray-400 hover:text-white",
                  )}
                >
                  {item.active ? (
                    <AnimatedIcon icon={item.icon.type} className="mr-2 h-4 w-4" size={16} animation={item.animation} />
                  ) : (
                    item.icon
                  )}
                  {item.name}
                </Button>
              </Link>
              {hoveredIndex === index && !item.active && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  layoutId="navbar-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </nav>
    </div>
  )
}


