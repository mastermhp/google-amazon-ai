"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Search, Loader2, FileText, LinkIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { generateContent, createContent } from "@/lib/actions"

export default function GoogleCustomSearch() {
  const searchElementRef = useRef(null)
  const [searchResults, setSearchResults] = useState([])
  const [keyword, setKeyword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [activeTab, setActiveTab] = useState("search")
  const [error, setError] = useState(null)

  useEffect(() => {
    // Hide the original Google search box
    const style = document.createElement("style")
    style.innerHTML = `
      .gsc-control-cse, .gsc-control-wrapper-cse { display: none !important; }
      .gsc-results-wrapper-overlay { max-width: 90vw !important; }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    if (window.google && searchElementRef.current) {
      window.google.search.cse.element.render({
        div: searchElementRef.current,
        tag: "search",
        gname: "my-custom-search",
      })

      const element = window.google.search.cse.element.getElement("my-custom-search")
      element.execute(keyword) // This will trigger the search
    }
  }, [keyword])

  useEffect(() => {
    window.__gcse = {
      searchCallbacks: {
        web: {
          ready: (name, q, promos, results, resultsDiv) => {
            setIsSearching(false)
            if (results && results.length > 0) {
              setSearchResults(
                results.map((result) => ({
                  title: result.title,
                  snippet: result.contentNoFormatting,
                  link: result.url,
                })),
              )
              setActiveTab("results")
            } else {
              setSearchResults([])
            }
          },
        },
      },
    }
  }, [])

  const handleSearch = () => {
    if (!keyword.trim()) return
    setIsSearching(true)
    setSearchResults([])
    setError(null)

    // Trigger the Google search
    if (window.google && window.google.search && window.google.search.cse && window.google.search.cse.element) {
      const element = window.google.search.cse.element.getElement("my-custom-search")
      if (element) {
        element.execute(keyword)
      }
    }
  }

  const handleDirectSearch = async () => {
    if (!keyword.trim()) return
    setIsSearching(true)
    setSearchResults([])
    setError(null)

    try {
      // Use the server action to search directly
      const results = await createContent({ keyword })
      setActiveTab("content")
      setGeneratedContent(results)
    } catch (error) {
      console.error("Error searching and generating:", error)
      setError("Failed to search and generate content. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleGenerateContent = async () => {
    if (searchResults.length === 0) {
      alert("Please search for a keyword first to get results")
      return
    }

    setIsLoading(true)
    setActiveTab("content")
    setError(null)

    try {
      const content = await generateContent({ keyword, searchResults })
      setGeneratedContent(content)
    } catch (error) {
      console.error("Error generating content:", error)
      setError("Failed to generate content. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Script src="https://cse.google.com/cse.js?cx=c05950bba54f44fc8" strategy="lazyOnload" />

      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Search & Generate Content</CardTitle>
          <CardDescription>
            Enter a keyword to search for relevant content and generate SEO-optimized articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Enter keyword or topic..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !keyword.trim()}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
            <Button onClick={handleDirectSearch} disabled={isSearching || !keyword.trim()} variant="outline">
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Direct Generate"
              )}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {/* Hidden Google Search Element */}
      <div className="hidden" ref={searchElementRef}></div>

      {/* Results and Content Tabs */}
      {(searchResults.length > 0 || generatedContent) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Search Results</TabsTrigger>
            <TabsTrigger value="content">Generated Content</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Found {searchResults.length} results for "{keyword}"
              </h3>
              <Button onClick={handleGenerateContent} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-4">
              {searchResults.map((result, index) => (
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
                      <span className="truncate max-w-[200px]">{result.link}</span>
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

          <TabsContent value="content">
            {isLoading ? (
              <Card className="w-full p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-center text-lg font-medium">
                    Analyzing search results and generating SEO-optimized content...
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    This may take a minute or two depending on the complexity of the topic.
                  </p>
                </div>
              </Card>
            ) : generatedContent ? (
              <Card className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-bold">{generatedContent.title}</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      SEO Optimized
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: generatedContent.content.replace(/\n/g, "<br/>") }}
                  />
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <p className="text-sm text-gray-500">Generated based on search results for "{keyword}"</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent.content)
                      alert("Content copied to clipboard!")
                    }}
                  >
                    Copy Content
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="w-full p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <p className="text-center text-lg font-medium">No content generated yet</p>
                  <p className="text-center text-sm text-gray-500">
                    Search for a keyword and click "Generate Content" to create SEO-optimized content
                  </p>
                  <Button onClick={() => setActiveTab("results")}>Go to Search Results</Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

