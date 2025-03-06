"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, ShoppingBag, History, Settings, Home } from "lucide-react"

export default function MainNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
      active: pathname === "/",
    },
    {
      name: "Google Content",
      href: "/google-content",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/google-content",
    },
    {
      name: "Amazon Reviews",
      href: "/amazon-review",
      icon: <ShoppingBag className="mr-2 h-4 w-4" />,
      active: pathname.includes("amazon-review") && !pathname.includes("history"),
    },
    {
      name: "All History",
      href: "/all-content",
      icon: <History className="mr-2 h-4 w-4" />,
      active: pathname === "/all-content",
    },
    {
      name: "Google History",
      href: "/history",
      icon: <History className="mr-2 h-4 w-4" />,
      active: pathname === "/history" || (pathname.startsWith("/history/") && !pathname.includes("amazon")),
    },
    {
      name: "Amazon History",
      href: "/amazon-review/history",
      icon: <History className="mr-2 h-4 w-4" />,
      active: pathname === "/amazon-review/history" || pathname.startsWith("/amazon-review/history/"),
    },
    {
      name: "Admin",
      href: "/admin",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname.startsWith("/admin"),
    },
  ]

  return (
    <nav className="flex items-center space-x-2 lg:space-x-4 overflow-x-auto pb-2">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={item.active ? "default" : "ghost"}
            className={cn("justify-start whitespace-nowrap", item.active && "bg-primary text-primary-foreground")}
          >
            {item.icon}
            {item.name}
          </Button>
        </Link>
      ))}
    </nav>
  )
}

