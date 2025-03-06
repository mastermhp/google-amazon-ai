"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2, ArrowLeft, Trash2, ExternalLink } from "lucide-react"
import { getAmazonReviewHistoryAction, deleteAmazonReviewAction } from "@/lib/actions"

export default function AmazonReviewHistoryPage() {
  const [reviews, setReviews] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const limit = 10

  useEffect(() => {
    loadReviews()
  }, [page]) // Load reviews when page changes

  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const data = await getAmazonReviewHistoryAction(page, limit)
      setReviews(data.reviews)
      setTotal(data.total)

      // Log the data to help debug
      console.log("Amazon review history loaded from MongoDB:", data)
    } catch (error) {
      console.error("Error loading Amazon review history:", error)
      setError("Failed to load Amazon review history")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReview = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return
    }

    try {
      await deleteAmazonReviewAction(id)
      await loadReviews()
    } catch (error) {
      console.error("Error deleting Amazon review:", error)
      setError("Failed to delete Amazon review")
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Amazon Review History</h1>
        <Link href="/amazon-review">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Amazon Review Generator
          </Button>
        </Link>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-6">{error}</div>}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{review.title}</CardTitle>
                    <CardDescription>Keywords: {review.keywords}</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-gray-600">
                  {review.content.replace(/^#.+$/gm, "").replace(/\*\*/g, "").slice(0, 200)}...
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-sm text-gray-500">Generated: {new Date(review.createdAt).toLocaleString()}</div>
                <Link href={`/amazon-review/history/${review._id}`}>
                  <Button size="sm" className="flex items-center">
                    View Review <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink isActive={page === p} onClick={() => setPage(p)}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No Amazon review history found.</p>
            <Link href="/amazon-review">
              <Button>Generate Your First Amazon Review</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

