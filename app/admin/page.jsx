"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getContentHistoryAction } from "@/lib/actions"
import { getPromptTemplatesAction } from "@/lib/actions"
import { getAmazonReviewHistoryAction } from "@/lib/actions"
import { getAmazonPromptTemplatesAction } from "@/lib/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, ShoppingBag, BarChart, Clock, FileCode } from "lucide-react"
import { motion } from "framer-motion"
import AdminLayout from "../components/admin-layout"
import { AnimatedIcon } from "../components/animated-icon"

export default function AdminDashboard() {
  const [googleContents, setGoogleContents] = useState([])
  const [googleTotal, setGoogleTotal] = useState(0)
  const [amazonReviews, setAmazonReviews] = useState([])
  const [amazonTotal, setAmazonTotal] = useState(0)
  const [promptTemplates, setPromptTemplates] = useState([])
  const [amazonPromptTemplates, setAmazonPromptTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const contentData = await getContentHistoryAction(1, 5)
        setGoogleContents(contentData.contents)
        setGoogleTotal(contentData.total)

        const amazonData = await getAmazonReviewHistoryAction(1, 5)
        setAmazonReviews(amazonData.reviews)
        setAmazonTotal(amazonData.total)

        const templates = await getPromptTemplatesAction()
        setPromptTemplates(templates)

        const amazonTemplates = await getAmazonPromptTemplatesAction()
        setAmazonPromptTemplates(amazonTemplates)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate total content count
  const totalContent = googleTotal + amazonTotal

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-blue-500">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome to your AI content generation control center</p>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-gray-200">
                <AnimatedIcon icon={BarChart} className="mr-2 text-blue-400" size={20} animation="pulse" />
                Total Content
              </CardTitle>
              <CardDescription>Generated content count</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.p
                className="text-4xl font-bold text-white"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {totalContent}
              </motion.p>
              <div className="mt-2 text-sm text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Google Content:</span>
                  <span className="text-blue-400">{googleTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Amazon Reviews:</span>
                  <span className="text-purple-400">{amazonTotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-gray-200">
                <AnimatedIcon icon={FileCode} className="mr-2 text-cyan-400" size={20} animation="float" />
                Prompt Templates
              </CardTitle>
              <CardDescription>Available templates</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.p
                className="text-4xl font-bold text-white"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {promptTemplates.length + amazonPromptTemplates.length}
              </motion.p>
              <div className="mt-2 text-sm text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Google Templates:</span>
                  <span className="text-blue-400">{promptTemplates.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Amazon Templates:</span>
                  <span className="text-purple-400">{amazonPromptTemplates.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-gray-200">
                <AnimatedIcon icon={Clock} className="mr-2 text-green-400" size={20} animation="spin" />
                Recent Activity
              </CardTitle>
              <CardDescription>Last content generation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-white">
                {googleContents.length > 0 || amazonReviews.length > 0 ? (
                  <>
                    {googleContents.length > 0 && amazonReviews.length > 0
                      ? new Date(
                          Math.max(
                            new Date(googleContents[0].createdAt).getTime(),
                            new Date(amazonReviews[0].createdAt).getTime(),
                          ),
                        ).toLocaleString()
                      : googleContents.length > 0
                        ? new Date(googleContents[0].createdAt).toLocaleString()
                        : new Date(amazonReviews[0].createdAt).toLocaleString()}
                  </>
                ) : (
                  "No recent activity"
                )}
              </p>
              <div className="mt-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  <span>System active and running</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center text-gray-200">
                    <AnimatedIcon icon={FileText} className="mr-2 text-blue-400" size={20} animation="pulse" />
                    Recent Google Content
                  </CardTitle>
                  <CardDescription>Recently generated Google content</CardDescription>
                </div>
                <Link href="/history">
                  <Button variant="neon" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {googleContents.length > 0 ? (
                  googleContents.map((content, index) => (
                    <motion.div
                      key={content._id}
                      className="border-b border-gray-800 pb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className="font-medium text-white">{content.title}</h3>
                      <p className="text-sm text-gray-400">
                        Keyword: {content.keyword} | Type: {content.contentType} | Generated:{" "}
                        {new Date(content.createdAt).toLocaleString()}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400">No Google content generated yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center text-gray-200">
                    <AnimatedIcon icon={ShoppingBag} className="mr-2 text-purple-400" size={20} animation="bounce" />
                    Recent Amazon Reviews
                  </CardTitle>
                  <CardDescription>Recently generated Amazon reviews</CardDescription>
                </div>
                <Link href="/amazon-review/history">
                  <Button variant="holographic" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {amazonReviews.length > 0 ? (
                  amazonReviews.map((review, index) => (
                    <motion.div
                      key={review._id}
                      className="border-b border-gray-800 pb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className="font-medium text-white">{review.title}</h3>
                      <p className="text-sm text-gray-400">
                        Keywords: {review.keywords} | Generated: {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400">No Amazon reviews generated yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={item}
          className="flex justify-center gap-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/google-content">
            <Button variant="cyber" className="group">
              <AnimatedIcon icon={FileText} className="mr-2 h-4 w-4" size={16} animation="pulse" />
              Google Content Generator
            </Button>
          </Link>
          <Link href="/amazon-review">
            <Button variant="glitch" className="group">
              <AnimatedIcon icon={ShoppingBag} className="mr-2 h-4 w-4" size={16} animation="bounce" />
              Amazon Review Generator
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </AdminLayout>
  )
}

