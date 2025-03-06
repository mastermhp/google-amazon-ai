"use client"
import { useState, useEffect } from "react"
import { Loader2, FileText, Edit, Check, Copy, Download } from "lucide-react"
import SeoMetrics from "./seo-metrics"
import ReactMarkdown from "react-markdown"
import { saveAmazonReviewAction, getAmazonPromptTemplatesAction } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AmazonContentGenerator({ products }) {
  const router = useRouter()
  const [keywords, setKeywords] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [content, setContent] = useState("")
  const [seoMetrics, setSeoMetrics] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [promptTemplates, setPromptTemplates] = useState([])
  const [promptTemplateId, setPromptTemplateId] = useState("default")
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
  const [activeTab, setActiveTab] = useState("content")

  useEffect(() => {
    // Load prompt templates
    const loadTemplates = async () => {
      try {
        const templates = await getAmazonPromptTemplatesAction()
        setPromptTemplates(templates)
      } catch (error) {
        console.error("Error loading prompt templates:", error)
      } finally {
        setIsLoadingTemplates(false)
      }
    }

    loadTemplates()
  }, [])

  const generateContent = async () => {
    if (!products || products.length === 0) {
      alert("Please search for products first")
      return
    }

    setIsGenerating(true)
    setActiveTab("content")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products,
          keywords,
          promptTemplateId: promptTemplateId !== "default" ? promptTemplateId : undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate content")
      }

      const data = await response.json()
      setContent(data.content)
      setEditableContent(data.content)
      setSeoMetrics(data.seoMetrics)

      // Save to MongoDB
      const titleMatch = data.content.match(/^# (.+)$/m)
      const title = titleMatch ? titleMatch[1] : `Amazon Product Review`

      await saveAmazonReviewAction({
        title,
        content: data.content,
        products,
        keywords: keywords || "best products, product comparison, product review",
        seoMetrics: data.seoMetrics,
        promptTemplateId: promptTemplateId !== "default" ? promptTemplateId : undefined,
      })

      // Refresh the router to update any history views
      router.refresh()
    } catch (error) {
      console.error("Error generating content:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(isEditing ? editableContent : content)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleDownloadContent = () => {
    const element = document.createElement("a")
    const file = new Blob([isEditing ? editableContent : content], { type: "text/markdown" })
    element.href = URL.createObjectURL(file)
    element.download = `product-review-${new Date().toISOString().split("T")[0]}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleSaveEdit = () => {
    setContent(editableContent)
    setIsEditing(false)
    // Recalculate SEO metrics after edit
    const updatedSeoMetrics = {
      ...seoMetrics,
      wordCount: editableContent.split(/\s+/).length,
    }
    setSeoMetrics(updatedSeoMetrics)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Generate Amazon Review</CardTitle>
          <CardDescription>Create a comprehensive review of the selected products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                Target Keywords (comma separated)
              </label>
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="best products, product comparison, product review"
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="promptTemplate" className="text-sm font-medium text-gray-700">
                Prompt Template
              </label>
              <Select
                value={promptTemplateId}
                onValueChange={setPromptTemplateId}
                disabled={isLoadingTemplates || isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Template</SelectItem>
                  {promptTemplates.map((template) => (
                    <SelectItem key={template._id} value={template._id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-1 text-xs text-gray-500">
                <Link href="/admin/amazon-prompts">
                  <span className="text-blue-600 hover:underline">Manage templates</span>
                </Link>
              </div>
            </div>
          </div>

          <Button onClick={generateContent} disabled={isGenerating || products.length === 0} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Review
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {content && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl font-bold">
                    {content.match(/^# (.+)$/m)?.[1] || "Amazon Product Review"}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="ml-2">
                      SEO Optimized
                    </Badge>
                    {isEditing ? (
                      <Button onClick={handleSaveEdit} size="sm">
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    className="w-full h-[500px] p-4 border border-gray-300 rounded-md font-mono text-sm"
                  />
                ) : (
                  <div className="prose max-w-none dark:prose-invert">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <p className="text-sm text-gray-500">
                  Generated for {products.length} products with keywords:{" "}
                  {keywords || "best products, product comparison"}
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleCopyContent} className="flex items-center">
                    {copySuccess ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleDownloadContent} className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="seo">{seoMetrics && <SeoMetrics metrics={seoMetrics} />}</TabsContent>
        </Tabs>
      )}
    </div>
  )
}

