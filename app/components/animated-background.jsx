"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function AnimatedBackground() {
  const [shapes, setShapes] = useState([])

  useEffect(() => {
    // Generate random shapes
    const newShapes = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 300 + 200,
      color: getRandomColor(),
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }))

    setShapes(newShapes)
  }, [])

  const getRandomColor = () => {
    const colors = [
      "rgba(59, 130, 246, 0.6)", // Blue
      "rgba(139, 92, 246, 0.6)", // Purple
      "rgba(236, 72, 153, 0.6)", // Pink
      "rgba(6, 182, 212, 0.6)", // Cyan
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div className="animated-bg">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="animated-bg-shape"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            background: shape.color,
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -30, 50, -20, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: shape.duration,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  )
}

