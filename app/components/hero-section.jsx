"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useAnimation, useInView } from "framer-motion"
import { FileText, ShoppingBag, ArrowRight, Sparkles, Zap, Brain, Bot, Cpu, Code, TerminalSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedIcon } from "./animated-icon"
// import { AnimatedIcon } from "@/components/animated-icon"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const floatingIcons = [
    { icon: Sparkles, x: "10%", y: "20%", size: 24, color: "text-primary", animation: "float" },
    { icon: Zap, x: "85%", y: "15%", size: 28, color: "text-yellow-400", animation: "pulse" },
    { icon: Brain, x: "75%", y: "75%", size: 32, color: "text-purple-400", animation: "bounce" },
    { icon: Bot, x: "15%", y: "85%", size: 26, color: "text-blue-400", animation: "spin" },
    { icon: Cpu, x: "90%", y: "60%", size: 22, color: "text-green-400", animation: "wave" },
    { icon: Code, x: "20%", y: "40%", size: 20, color: "text-pink-400", animation: "blink" },
  ]

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-70"
          style={{
            transformOrigin: "center",
            transform: `translate(${mousePosition.x / 50}px, ${mousePosition.y / 50}px)`,
            transition: "transform 0.2s ease-out",
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(84,33,128,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(84,33,128,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

        {/* Animated circles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, rgba(84,33,128,0.8) 0%, rgba(84,33,128,0) 70%)`,
              width: `${Math.random() * 40 + 30}rem`,
              height: `${Math.random() * 40 + 30}rem`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating icons */}
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className="absolute z-0"
          style={{
            left: item.x,
            top: item.y,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
          >
            <AnimatedIcon icon={item.icon} className={`${item.color}`} size={item.size} animation={item.animation} />
          </motion.div>
        </div>
      ))}

      {/* Main content */}
      <div className="container mx-auto px-4 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Animated logo */}
          <motion.div variants={itemVariants} className="mb-8 inline-block">
            <motion.div
              className="relative w-24 h-24 mx-auto"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-purple-600 opacity-70 blur-xl animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-gray-900 flex items-center justify-center">
                <AnimatedIcon icon={Sparkles} className="text-primary" size={48} animation="float" />
              </div>

              {/* Orbiting elements */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-full"
                  style={{
                    transformOrigin: "center",
                  }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 15 + i * 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="absolute w-4 h-4 bg-primary rounded-full"
                    style={{
                      left: "50%",
                      top: i * 5,
                      transform: "translateX(-50%)",
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Title with animated gradient */}
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 relative">
              <span className="inline-block relative">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient">
                  AI Content Generator
                </span>
                <motion.span
                  className="absolute -inset-1 bg-primary/20 rounded-lg blur-xl"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </span>

              {/* Animated code brackets */}
              <motion.span
                className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-primary/70 font-mono text-5xl md:text-7xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {"{"}
              </motion.span>
              <motion.span
                className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-primary/70 font-mono text-5xl md:text-7xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {"}"}
              </motion.span>
            </h1>

            {/* Animated terminal effect */}
            <motion.div
              className="relative max-w-2xl mx-auto bg-gray-900/80 rounded-lg border border-gray-800 p-4 font-mono text-sm text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="flex items-center mb-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 flex items-center text-xs text-gray-400">
                  <TerminalSquare size={12} className="mr-2" />
                  <span>ai-content-generator</span>
                </div>
              </div>
              <TypewriterEffect text="Generating SEO-optimized content with advanced AI technology..." />
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            Create exceptional SEO-optimized content and product reviews with the power of cutting-edge artificial
            intelligence
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
            <Link href="/google-content">
              <Button variant="neon" size="lg" className="group text-lg">
                <AnimatedIcon icon={FileText} className="mr-2" size={20} animation="pulse" />
                Google Content
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Button>
            </Link>

            <Link href="/amazon-review">
              <Button variant="holographic" size="lg" className="group text-lg">
                <AnimatedIcon icon={ShoppingBag} className="mr-2" size={20} animation="bounce" />
                Amazon Reviews
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Button>
            </Link>
          </motion.div>

          {/* Animated stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          >
            {[
              { label: "Content Generated", value: "10M+", icon: FileText, color: "text-primary" },
              { label: "AI Models", value: "Latest", icon: Brain, color: "text-purple-400" },
              { label: "User Satisfaction", value: "99.8%", icon: Zap, color: "text-yellow-400" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col items-center">
                  <AnimatedIcon icon={stat.icon} className={`${stat.color} mb-4`} size={32} animation="pulse" />
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <motion.div
              className="w-6 h-10 rounded-full border-2 border-gray-500 flex justify-center p-1"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.div
                className="w-1 h-2 bg-primary rounded-full"
                animate={{
                  y: [0, 12, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Typewriter effect component
function TypewriterEffect({ text }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 50) // Typing speed

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex">
      <span className="text-green-400">$ </span>
      <span className="ml-2">{displayText}</span>
      {showCursor && <span className="animate-pulse">|</span>}
    </div>
  )
}

