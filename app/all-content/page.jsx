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
import { Loader2, Trash2, ExternalLink, FileText, ShoppingBag } from "lucide-react"
import { getAllContentHistoryAction, deleteContentAction, deleteAmazonReviewAction } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"

export default function AllContentHistoryPage() {
  const [contents, setContents] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const limit = 10

  useEffect(() => {
    loadContents()
  }, [page]) // Load contents when page changes

  const loadContents = async () => {
    setIsLoading(true)
    try {
      const data = await getAllContentHistoryAction(page, limit)
      setContents(data.contents)
      setTotal(data.total)

      // Log the data to help debug
      console.log("All content history loaded from MongoDB:", data)
    } catch (error) {
      console.error("Error loading content history:", error)
      setError("Failed to load content history")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteContent = async (id, type) => {
    if (!confirm("Are you sure you want to delete this content?")) {
      return
    }

    try {
      if (type === "google-search") {
        await deleteContentAction(id)
      } else if (type === "amazon-review") {
        await deleteAmazonReviewAction(id)
      }
      await loadContents()
    } catch (error) {
      console.error("Error deleting content:", error)
      setError("Failed to delete content")
    }
  }

  const getContentLink = (content) => {
    if (content.type === "google-search") {
      return `/history/${content._id}`
    } else if (content.type === "amazon-review") {
      return `/amazon-review/history/${content._id}`
    }
    return "#"
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Content History</h1>
        <div className="flex space-x-2">
          <Link href="/">
            <Button variant="outline" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Google Generator
            </Button>
          </Link>
          <Link href="/amazon-review">
            <Button variant="outline" className="flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Amazon Generator
            </Button>
          </Link>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-6">{error}</div>}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : contents.length > 0 ? (
        <div className="space-y-6">
          {contents.map((content) => (
            <Card key={content._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{content.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {content.type === "google-search" ? (
                        <>
                          <Badge variant="outline" className="bg-blue-50">
                            Google Content
                          </Badge>
                          Keyword: {content.keyword}
                        </>
                      ) : (
                        <>
                          <Badge variant="outline" className="bg-yellow-50">
                            Amazon Review
                          </Badge>
                          Keywords: {content.keywords}
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteContent(content._id, content.type)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-gray-600">
                  {content.content.replace(/^#.+$/gm, "").replace(/\*\*/g, "").slice(0, 200)}...
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-sm text-gray-500">Generated: {new Date(content.createdAt).toLocaleString()}</div>
                <Link href={getContentLink(content)}>
                  <Button size="sm" className="flex items-center">
                    View Content <ExternalLink className="ml-1 h-3 w-3" />
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
            <p className="text-gray-500 mb-4">No content history found.</p>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button>Generate Google Content</Button>
              </Link>
              <Link href="/amazon-review">
                <Button variant="outline">Generate Amazon Review</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

