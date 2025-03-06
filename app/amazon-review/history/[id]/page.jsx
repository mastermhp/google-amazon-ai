"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import { getAmazonReviewByIdAction } from "@/lib/actions"
import ReactMarkdown from "react-markdown"

export default function AmazonReviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [review, setReview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      loadReview(params.id)
    }
  }, [params.id])

  const loadReview = async (id) => {
    setIsLoading(true)
    try {
      const data = await getAmazonReviewByIdAction(id)
      if (!data) {
        setError("Review not found")
        return
      }
      setReview(data)
    } catch (error) {
      console.error("Error loading Amazon review:", error)
      setError("Failed to load Amazon review")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => router.push("/amazon-review/history")}>
            Back to History
          </Button>
        </div>
      </div>
    )
  }

  if (!review) {
    return null
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Link href="/amazon-review/history">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
        </Link>
        <div className="text-sm text-gray-500">Generated: {new Date(review.createdAt).toLocaleString()}</div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{review.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <ReactMarkdown>{review.content}</ReactMarkdown>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-gray-500">Keywords: {review.keywords}</p>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(review.content)
              alert("Content copied to clipboard!")
            }}
          >
            Copy Content
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

