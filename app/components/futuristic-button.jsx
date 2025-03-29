"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function FuturisticButton({ children, className, variant = "blue", onClick, disabled = false, ...props }) {
  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return "border-blue-500 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] hover:bg-blue-500/10"
      case "purple":
        return "border-purple-500 text-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.5)] hover:shadow-[0_0_15px_rgba(147,51,234,0.8)] hover:bg-purple-500/10"
      case "pink":
        return "border-pink-500 text-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)] hover:shadow-[0_0_15px_rgba(236,72,153,0.8)] hover:bg-pink-500/10"
      case "cyan":
        return "border-cyan-500 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] hover:shadow-[0_0_15px_rgba(6,182,212,0.8)] hover:bg-cyan-500/10"
      default:
        return "border-blue-500 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] hover:bg-blue-500/10"
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative px-6 py-2 bg-transparent border rounded-md font-medium transition-all duration-300",
        getVariantStyles(),
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}

