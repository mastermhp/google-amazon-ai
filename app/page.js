"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, ShoppingBag, History, Settings, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
            AI Content Generator
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
            Create SEO-optimized content and product reviews with the power of artificial intelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-purple-950 p-8 rounded-xl h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-800 rounded-lg mr-4">
                  <FileText className="h-8 w-8 text-purple-200" />
                </div>
                <h2 className="text-2xl font-bold">Google Content Generator</h2>
              </div>
              <p className="text-purple-200 mb-6 flex-grow">
                Generate comprehensive, SEO-optimized articles and blog posts based on Google search results. Perfect
                for content marketing and SEO.
              </p>
              <Link href="/google-content" className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-purple-950 p-8 rounded-xl h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-amber-800 rounded-lg mr-4">
                  <ShoppingBag className="h-8 w-8 text-amber-200" />
                </div>
                <h2 className="text-2xl font-bold">Amazon Review Generator</h2>
              </div>
              <p className="text-purple-200 mb-6 flex-grow">
                Create detailed product reviews and comparisons based on Amazon products. Ideal for affiliate marketing
                and product recommendations.
              </p>
              <Link href="/amazon-review" className="w-full">
                <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white border-0 group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold mb-6 text-purple-200">Additional Features</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/all-content">
              <Button
                variant="outline"
                className="bg-purple-900/50 text-purple-200 border-purple-700 hover:bg-purple-800 hover:text-white"
              >
                <History className="mr-2 h-5 w-5" />
                Content History
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                variant="outline"
                className="bg-purple-900/50 text-purple-200 border-purple-700 hover:bg-purple-800 hover:text-white"
              >
                <Settings className="mr-2 h-5 w-5" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-600/20 blur-3xl"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 40 - 20],
                y: [0, Math.random() * 40 - 20],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

