import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Download, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SeoMetrics } from "@/app/components/seo-metrics"
// import { SeoMetrics } from "@/components/seo-metrics"

async function getContent(id) {
  // This is a placeholder. You need to implement the actual database fetching logic.
  // For example, using Prisma or another ORM to fetch from your database.
  console.log("Fetching content with id:", id)
  // For now, we'll return mock data to demonstrate the structure
  return {
    id,
    title: "Sample Content",
    keyword: "sample keyword",
    content: "<h2>Sample Content</h2><p>This is a placeholder for real content.</p>",
    images: ["/placeholder.svg?height=400&width=600"],
    seoMetrics: {
      keywordDensity: 2.0,
      readabilityScore: 70,
      wordCount: 100,
      headingStructure: "Optimized",
      metaDescription: "This is a sample meta description.",
      suggestedKeywords: ["sample", "keyword", "content"],
    },
    createdAt: new Date().toISOString(),
  }
}

export default async function ContentPage({ params }) {
  const content = await getContent(params.id)

  if (!content) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{content.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Keyword: <span className="font-medium">{content.keyword}</span> • Generated on{" "}
          {new Date(content.createdAt).toLocaleDateString()}
        </div>

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="seo">SEO Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div
                  className="prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="images" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated Images</CardTitle>
                <CardDescription>Custom images generated for your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.images.map((image, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Generated image ${index + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                      <div className="p-3 border-t">
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Image
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="seo" className="mt-6">
            <SeoMetrics metrics={content.seoMetrics} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

