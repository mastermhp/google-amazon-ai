import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getContentHistoryAction } from "@/lib/actions"
import { getPromptTemplatesAction } from "@/lib/actions"
import { getAmazonReviewHistoryAction } from "@/lib/actions"
import { getAmazonPromptTemplatesAction } from "@/lib/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, ShoppingBag } from "lucide-react"
import AdminLayout from "../components/admin-layout"

export default async function AdminDashboard() {
  let googleContents = []
  let googleTotal = 0
  let amazonReviews = []
  let amazonTotal = 0
  let promptTemplates = []
  let amazonPromptTemplates = []

  try {
    const contentData = await getContentHistoryAction(1, 5)
    googleContents = contentData.contents
    googleTotal = contentData.total
  } catch (error) {
    console.error("Error loading Google content history:", error)
  }

  try {
    const amazonData = await getAmazonReviewHistoryAction(1, 5)
    amazonReviews = amazonData.reviews
    amazonTotal = amazonData.total
  } catch (error) {
    console.error("Error loading Amazon review history:", error)
  }

  try {
    promptTemplates = await getPromptTemplatesAction()
  } catch (error) {
    console.error("Error loading Google prompt templates:", error)
  }

  try {
    amazonPromptTemplates = await getAmazonPromptTemplatesAction()
  } catch (error) {
    console.error("Error loading Amazon prompt templates:", error)
  }

  // Calculate total content count
  const totalContent = googleTotal + amazonTotal

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Content</CardTitle>
              <CardDescription>Generated content count</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totalContent}</p>
              <div className="mt-2 text-sm text-gray-500">
                <div>Google Content: {googleTotal}</div>
                <div>Amazon Reviews: {amazonTotal}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Prompt Templates</CardTitle>
              <CardDescription>Available templates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{promptTemplates.length + amazonPromptTemplates.length}</p>
              <div className="mt-2 text-sm text-gray-500">
                <div>Google Templates: {promptTemplates.length}</div>
                <div>Amazon Templates: {amazonPromptTemplates.length}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Last content generation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
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
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Google Content</CardTitle>
                  <CardDescription>Recently generated Google content</CardDescription>
                </div>
                <Link href="/history">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {googleContents.length > 0 ? (
                  googleContents.map((content) => (
                    <div key={content._id} className="border-b pb-4">
                      <h3 className="font-medium">{content.title}</h3>
                      <p className="text-sm text-gray-500">
                        Keyword: {content.keyword} | Type: {content.contentType} | Generated:{" "}
                        {new Date(content.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No Google content generated yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Amazon Reviews</CardTitle>
                  <CardDescription>Recently generated Amazon reviews</CardDescription>
                </div>
                <Link href="/amazon-review/history">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {amazonReviews.length > 0 ? (
                  amazonReviews.map((review) => (
                    <div key={review._id} className="border-b pb-4">
                      <h3 className="font-medium">{review.title}</h3>
                      <p className="text-sm text-gray-500">
                        Keywords: {review.keywords} | Generated: {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No Amazon reviews generated yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Google Content Generator
            </Button>
          </Link>
          <Link href="/amazon-review">
            <Button variant="outline" className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Amazon Review Generator
            </Button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}

