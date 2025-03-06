"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, ExternalLink, LinkIcon } from "lucide-react"
import { getContentByIdAction } from "@/lib/actions"

// Country mapping
const COUNTRIES = {
  us: "United States",
  gb: "United Kingdom",
  ca: "Canada",
  au: "Australia",
  in: "India",
  de: "Germany",
  fr: "France",
  jp: "Japan",
  br: "Brazil",
  mx: "Mexico",
}

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("content")

  useEffect(() => {
    if (params.id) {
      loadContent(params.id)
    }
  }, [params.id])

  const loadContent = async (id) => {
    setIsLoading(true)
    try {
      const data = await getContentByIdAction(id)
      if (!data) {
        setError("Content not found")
        return
      }
      setContent(data)
    } catch (error) {
      console.error("Error loading content:", error)
      setError("Failed to load content")
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = (content, images) => {
    if (!content) return ""

    let renderedContent = content
      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-3 mb-2">$1</h4>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br/>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")

    if (images && images.length > 0) {
      images.forEach((image, index) => {
        const placeholder = `[IMAGE${index + 1}]`
        const imageHtml = `
          <figure class="my-4">
            <img src="${image.thumbnail}" alt="${image.title}" class="w-full h-auto rounded-lg shadow-md" />
            <figcaption class="text-sm text-gray-500 mt-2">${image.title}</figcaption>
          </figure>
        `
        renderedContent = renderedContent.replace(placeholder, imageHtml)
      })
    }

    return renderedContent
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
          <Button className="mt-4" onClick={() => router.push("/history")}>
            Back to History
          </Button>
        </div>
      </div>
    )
  }

  if (!content) {
    return null
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Link href="/history">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
        </Link>
        <div className="text-sm text-gray-500">Generated: {new Date(content.createdAt).toLocaleString()}</div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
          <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
          <TabsTrigger value="affiliate">Affiliate Links</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="ml-2">
                    {content.contentType.charAt(0).toUpperCase() + content.contentType.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="ml-2">
                    {COUNTRIES[content.country] || content.country}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: renderContent(content.content, content.imageResults),
                }}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <p className="text-sm text-gray-500">
                Generated based on search results for "{content.keyword}" in{" "}
                {COUNTRIES[content.country] || content.country}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(content.content)
                  alert("Content copied to clipboard!")
                }}
              >
                Copy Content
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <h3 className="text-lg font-medium">
            Top search results for "{content.keyword}" in {COUNTRIES[content.country] || content.country}
          </h3>

          <div className="grid gap-4">
            {content.searchResults.map((result, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium line-clamp-2">{result.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600 line-clamp-3">{result.snippet}</p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <LinkIcon className="mr-1 h-3 w-3" />
                    <span className="truncate max-w-[200px]">{result.displayLink}</span>
                  </div>
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                  >
                    Visit <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Word Count</dt>
                  <dd className="text-lg font-semibold">{content.seoAnalysis.wordCount}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Keyword Density</dt>
                  <dd className="text-lg font-semibold">{content.seoAnalysis.keywordDensity}%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Headings Count</dt>
                  <dd className="text-lg font-semibold">{content.seoAnalysis.headingsCount}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Paragraph Count</dt>
                  <dd className="text-lg font-semibold">{content.seoAnalysis.paragraphCount}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Avg. Sentence Length</dt>
                  <dd className="text-lg font-semibold">{content.seoAnalysis.averageSentenceLength} words</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Readability Score</dt>
                  <dd className="text-lg font-semibold">{content.readabilityScore}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Link Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {content.affiliateLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {link.name} <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

