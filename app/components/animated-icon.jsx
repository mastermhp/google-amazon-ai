"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function AnimatedIcon({
  icon: Icon,
  className,
  size = 24,
  color = "currentColor",
  animation = "pulse",
  ...props
}) {
  // Different animation variants
  const animations = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    spin: {
      rotate: [0, 360],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    wave: {
      rotate: [0, 15, 0, -15, 0],
      transition: {
        duration: 2.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    blink: {
      opacity: [1, 0.3, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    float: {
      y: [0, -8, 0],
      x: [0, 3, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    glitch: {
      x: [0, -2, 0, 2, 0],
      y: [0, 1, 0, -1, 0],
      transition: {
        duration: 0.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
      },
    },
  }

  return (
    <motion.div
      animate={animations[animation]}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Icon size={size} color={color} />
    </motion.div>
  )
}

