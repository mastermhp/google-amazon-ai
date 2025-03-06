"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createContent } from "@/lib/actions"

export function KeywordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [contentType, setContentType] = useState("blog")
  const [contentLength, setContentLength] = useState("medium")

  async function handleSubmit(e) {
    e.preventDefault()

    if (!keyword.trim()) return

    setIsLoading(true)

    try {
      const contentId = await createContent({
        keyword,
        additionalInfo,
        contentType,
        contentLength,
      })

      router.push(`/content/${contentId}`)
    } catch (error) {
      console.error("Error creating content:", error)
      setIsLoading(false)
      // You might want to add error handling UI here
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="keyword">Keyword or Topic</Label>
        <Input
          id="keyword"
          placeholder="e.g., digital marketing tips 2024"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="content-type">Content Type</Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger id="content-type">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">Blog Post</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="product">Product Description</SelectItem>
              <SelectItem value="social">Social Media Post</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content-length">Content Length</Label>
          <Select value={contentLength} onValueChange={setContentLength}>
            <SelectTrigger id="content-length">
              <SelectValue placeholder="Select content length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (~500 words)</SelectItem>
              <SelectItem value="medium">Medium (~1000 words)</SelectItem>
              <SelectItem value="long">Long (~1500 words)</SelectItem>
              <SelectItem value="comprehensive">Comprehensive (~2000+ words)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional-info">Additional Information (Optional)</Label>
        <Textarea
          id="additional-info"
          placeholder="Add any specific requirements, target audience, or preferences for your content"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Content...
          </>
        ) : (
          "Generate Content"
        )}
      </Button>
    </form>
  )
}

