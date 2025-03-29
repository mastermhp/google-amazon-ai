"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function CyberCard({ children, className, variant = "blue", glowing = true, ...props }) {
  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return "border-blue-500/30 " + (glowing ? "shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "")
      case "purple":
        return "border-purple-500/30 " + (glowing ? "shadow-[0_0_15px_rgba(147,51,234,0.3)]" : "")
      case "pink":
        return "border-pink-500/30 " + (glowing ? "shadow-[0_0_15px_rgba(236,72,153,0.3)]" : "")
      case "cyan":
        return "border-cyan-500/30 " + (glowing ? "shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "")
      default:
        return "border-blue-500/30 " + (glowing ? "shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative bg-gray-900/80 backdrop-blur-sm border rounded-lg overflow-hidden",
        getVariantStyles(),
        className,
      )}
      {...props}
    >
      {/* Top left corner */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>

      {/* Top right corner */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>

      {/* Bottom left corner */}
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>

      {/* Bottom right corner */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>

      {children}
    </motion.div>
  )
}

