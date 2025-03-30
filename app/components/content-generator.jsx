

// "use client"

// import { CardFooter } from "@/components/ui/card"
// import { useState } from "react"
// import { Search, Loader2, FileText, LinkIcon, ExternalLink, Edit2, Save } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { searchAndGenerate, updateContent } from "@/lib/actions"
// import { useRouter } from "next/navigation"

// // Country options for search
// const COUNTRIES = [
//   { value: "us", label: "United States" },
//   { value: "gb", label: "United Kingdom" },
//   { value: "ca", label: "Canada" },
//   { value: "au", label: "Australia" },
//   { value: "in", label: "India" },
//   { value: "de", label: "Germany" },
//   { value: "fr", label: "France" },
//   { value: "jp", label: "Japan" },
//   { value: "br", label: "Brazil" },
//   { value: "mx", label: "Mexico" },
// ]

// export default function ContentGenerator({ promptTemplates = [] }) {
//   const router = useRouter()
//   const [keyword, setKeyword] = useState("")
//   const [contentType, setContentType] = useState("blog")
//   const [contentLength, setContentLength] = useState("medium")
//   const [country, setCountry] = useState("us")
//   const [promptTemplateId, setPromptTemplateId] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [activeTab, setActiveTab] = useState("content")
//   const [result, setResult] = useState(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [editedContent, setEditedContent] = useState("")

//   const handleGenerate = async () => {
//     if (!keyword.trim()) return

//     setIsLoading(true)
//     setError(null)

//     try {
//       const data = await searchAndGenerate({
//         keyword,
//         contentType,
//         contentLength,
//         country,
//         promptTemplateId: promptTemplateId || undefined,
//       })

//       console.log("Generated content:", data) // Add logging
//       setResult(data)
//       setEditedContent(data.content)
//       setActiveTab("content")

//       // Force a refresh of the history page
//       router.refresh()
//     } catch (error) {
//       console.error("Error generating content:", error)
//       setError(error.message || "Failed to generate content. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleEdit = () => {
//     setIsEditing(true)
//   }

//   const handleSave = async () => {
//     setIsLoading(true)
//     try {
//       const updatedContent = await updateContent({
//         id: result._id,
//         content: editedContent,
//       })
//       setResult({ ...result, content: updatedContent.content })
//       setIsEditing(false)
//     } catch (error) {
//       console.error("Error updating content:", error)
//       setError("Failed to update content. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleViewHistory = () => {
//     router.push("/history")
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleGenerate()
//     }
//   }

//   const renderContent = (content, images) => {
//     if (!content) return ""

//     let renderedContent = content
//       .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
//       .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
//       .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
//       .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-3 mb-2">$1</h4>')
//       .replace(/\n\n/g, '</p><p class="mb-4">')
//       .replace(/\n/g, "<br/>")
//       .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
//       .replace(/\*(.+?)\*/g, "<em>$1</em>")

//     if (images && images.length > 0) {
//       images.forEach((image, index) => {
//         const placeholder = `[IMAGE${index + 1}]`
//         const imageHtml = `
//           <figure class="my-4">
//             <img src="${image.thumbnail}" alt="${image.title}" class="w-full h-auto rounded-lg shadow-md" />
//             <figcaption class="text-sm text-gray-500 mt-2">${image.title}</figcaption>
//           </figure>
//         `
//         renderedContent = renderedContent.replace(placeholder, imageHtml)
//       })
//     }

//     return renderedContent
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto space-y-8">
//       <Card className="shadow-md">
//         <CardHeader className="pb-4">
//           <CardTitle className="text-2xl">AI Content Generator</CardTitle>
//           <CardDescription>Enter a keyword to search and generate SEO-optimized content</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="relative col-span-1 md:col-span-2">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <Input
//                 type="text"
//                 placeholder="Enter keyword or topic..."
//                 value={keyword}
//                 onChange={(e) => setKeyword(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="pl-10"
//               />
//             </div>

//             <Select value={contentType} onValueChange={setContentType}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Content Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="blog">Blog Post</SelectItem>
//                 <SelectItem value="article">Article</SelectItem>
//                 <SelectItem value="product">Product Description</SelectItem>
//                 <SelectItem value="social">Social Media</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={contentLength} onValueChange={setContentLength}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Content Length" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="short">Short</SelectItem>
//                 <SelectItem value="medium">Medium</SelectItem>
//                 <SelectItem value="long">Long</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={country} onValueChange={setCountry}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Search Country" />
//               </SelectTrigger>
//               <SelectContent>
//                 {COUNTRIES.map((country) => (
//                   <SelectItem key={country.value} value={country.value}>
//                     {country.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {promptTemplates && promptTemplates.length > 0 ? (
//               <Select value={promptTemplateId} onValueChange={setPromptTemplateId}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Prompt Template" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="default">Default Template</SelectItem>
//                   {promptTemplates.map((template) => (
//                     <SelectItem key={template._id} value={template._id}>
//                       {template.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             ) : (
//               <Select disabled value="default" onValueChange={() => {}}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Prompt Templates Unavailable" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="default">Default Template</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={handleGenerate} disabled={isLoading || !keyword.trim()} className="flex-1">
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Searching & Generating...
//                 </>
//               ) : (
//                 <>
//                   <FileText className="mr-2 h-4 w-4" />
//                   Generate Content
//                 </>
//               )}
//             </Button>

//             <Button onClick={handleViewHistory} variant="outline">
//               View History
//             </Button>
//           </div>

//           {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}
//         </CardContent>
//       </Card>

//       {result && (
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="content">Content</TabsTrigger>
//             <TabsTrigger value="search">Search Results</TabsTrigger>
//             <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
//             <TabsTrigger value="affiliate">Affiliate Links</TabsTrigger>
//           </TabsList>

//           <TabsContent value="content">
//             <Card className="w-full">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="text-2xl font-bold">{result.title}</CardTitle>
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="outline" className="ml-2">
//                       SEO Optimized
//                     </Badge>
//                     {isEditing ? (
//                       <Button onClick={handleSave} size="sm">
//                         <Save className="w-4 h-4 mr-2" />
//                         Save
//                       </Button>
//                     ) : (
//                       <Button onClick={handleEdit} size="sm">
//                         <Edit2 className="w-4 h-4 mr-2" />
//                         Edit
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {isEditing ? (
//                   <Textarea
//                     value={editedContent}
//                     onChange={(e) => setEditedContent(e.target.value)}
//                     className="w-full h-[500px]"
//                   />
//                 ) : (
//                   <div
//                     className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
//                     dangerouslySetInnerHTML={{
//                       __html: renderContent(result.content, result.imageResults),
//                     }}
//                   />
//                 )}
//               </CardContent>
//               <CardFooter className="flex justify-between border-t pt-6">
//                 <p className="text-sm text-gray-500">
//                   Generated based on search results for "{keyword}" in{" "}
//                   {COUNTRIES.find((c) => c.value === country)?.label}
//                 </p>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     navigator.clipboard.writeText(result.content)
//                     alert("Content copied to clipboard!")
//                   }}
//                 >
//                   Copy Content
//                 </Button>
//               </CardFooter>
//             </Card>
//           </TabsContent>

//           <TabsContent value="search" className="space-y-4">
//             <h3 className="text-lg font-medium">
//               Top 10 search results for "{keyword}" in {COUNTRIES.find((c) => c.value === country)?.label}
//             </h3>

//             <div className="grid gap-4">
//               {result.searchResults.map((result, index) => (
//                 <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg font-medium line-clamp-2">{result.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="pb-2">
//                     <p className="text-sm text-gray-600 line-clamp-3">{result.snippet}</p>
//                   </CardContent>
//                   <CardFooter className="pt-0 flex justify-between items-center">
//                     <div className="flex items-center text-xs text-gray-500">
//                       <LinkIcon className="mr-1 h-3 w-3" />
//                       <span className="truncate max-w-[200px]">{result.displayLink}</span>
//                     </div>
//                     <a
//                       href={result.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
//                     >
//                       Visit <ExternalLink className="ml-1 h-3 w-3" />
//                     </a>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="seo" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>SEO Analysis</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <dl className="grid grid-cols-2 gap-4">
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Word Count</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.wordCount}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Keyword Density</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.keywordDensity}%</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Headings Count</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.headingsCount}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Paragraph Count</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.paragraphCount}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Avg. Sentence Length</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.averageSentenceLength} words</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Readability Score</dt>
//                     <dd className="text-lg font-semibold">{result.readabilityScore}</dd>
//                   </div>
//                 </dl>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="affiliate" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Affiliate Link Suggestions</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2">
//                   {result.affiliateLinks.map((link, index) => (
//                     <li key={index}>
//                       <a
//                         href={link.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:text-blue-800 flex items-center"
//                       >
//                         {link.name} <ExternalLink className="ml-1 h-3 w-3" />
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       )}
//     </div>
//   )
// }




// "use client"

// import { CardFooter } from "@/components/ui/card"
// import { useState } from "react"
// import { Search, Loader2, FileText, LinkIcon, ExternalLink, Edit2, Save } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { searchAndGenerate, updateContent } from "@/lib/actions"
// import { useRouter } from "next/navigation"

// // Country options for search
// const COUNTRIES = [
//   { value: "us", label: "United States" },
//   { value: "gb", label: "United Kingdom" },
//   { value: "ca", label: "Canada" },
//   { value: "au", label: "Australia" },
//   { value: "in", label: "India" },
//   { value: "de", label: "Germany" },
//   { value: "fr", label: "France" },
//   { value: "jp", label: "Japan" },
//   { value: "br", label: "Brazil" },
//   { value: "mx", label: "Mexico" },
// ]

// export default function ContentGenerator({ promptTemplates = [] }) {
//   const router = useRouter()
//   const [keyword, setKeyword] = useState("")
//   const [contentType, setContentType] = useState("blog")
//   const [contentLength, setContentLength] = useState("medium")
//   const [country, setCountry] = useState("us")
//   const [promptTemplateId, setPromptTemplateId] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [activeTab, setActiveTab] = useState("content")
//   const [result, setResult] = useState(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [editedContent, setEditedContent] = useState("")

//   const handleGenerate = async () => {
//     if (!keyword.trim()) return

//     setIsLoading(true)
//     setError(null)

//     try {
//       // Add a client-side timeout
//       const controller = new AbortController()
//       const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

//       const data = await searchAndGenerate(
//         {
//           keyword,
//           contentType,
//           contentLength,
//           country,
//           promptTemplateId: promptTemplateId || undefined,
//         },
//         controller.signal,
//       )

//       clearTimeout(timeoutId)

//       console.log("Generated content:", data) // Add logging
//       setResult(data)
//       setEditedContent(data.content)
//       setActiveTab("content")

//       // Force a refresh of the history page
//       router.refresh()
//     } catch (error) {
//       console.error("Error generating content:", error)

//       if (error.name === "AbortError") {
//         setError("The request took too long to complete. Please try a simpler query or try again later.")

//         // Generate simplified content
//         const simplifiedContent = {
//           title: `${keyword} ${contentType}`,
//           content: `# ${keyword} ${contentType}\n\nThis is a simplified ${contentType} about ${keyword}.\n\n## Introduction\n\nThis content provides information about ${keyword}.\n\n## Key Points\n\n- Important information about ${keyword}\n- Relevant details for readers\n- Useful tips related to ${keyword}\n\n## Conclusion\n\nThank you for reading this ${contentType} about ${keyword}.`,
//           seoAnalysis: {
//             wordCount: 50,
//             keywordDensity: "2.0",
//             headingsCount: 3,
//             paragraphCount: 4,
//             averageSentenceLength: "8.0",
//           },
//           readabilityScore: "75.0",
//           affiliateLinks: [
//             { name: "Amazon", url: `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=youraffiliateid` },
//           ],
//           searchResults: [],
//           imageResults: [],
//         }

//         setResult(simplifiedContent)
//         setEditedContent(simplifiedContent.content)
//         setActiveTab("content")
//       } else {
//         setError(error.message || "Failed to generate content. Please try again.")
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleEdit = () => {
//     setIsEditing(true)
//   }

//   const handleSave = async () => {
//     setIsLoading(true)
//     try {
//       const updatedContent = await updateContent({
//         id: result._id,
//         content: editedContent,
//       })
//       setResult({ ...result, content: updatedContent.content })
//       setIsEditing(false)
//     } catch (error) {
//       console.error("Error updating content:", error)
//       setError("Failed to update content. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleViewHistory = () => {
//     router.push("/history")
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleGenerate()
//     }
//   }

//   const renderContent = (content, images) => {
//     if (!content) return ""

//     let renderedContent = content
//       .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
//       .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
//       .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
//       .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-3 mb-2">$1</h4>')
//       .replace(/\n\n/g, '</p><p class="mb-4">')
//       .replace(/\n/g, "<br/>")
//       .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
//       .replace(/\*(.+?)\*/g, "<em>$1</em>")

//     if (images && images.length > 0) {
//       images.forEach((image, index) => {
//         const placeholder = `[IMAGE${index + 1}]`
//         const imageHtml = `
//           <figure class="my-4">
//             <img src="${image.thumbnail}" alt="${image.title}" class="w-full h-auto rounded-lg shadow-md" />
//             <figcaption class="text-sm text-gray-500 mt-2">${image.title}</figcaption>
//           </figure>
//         `
//         renderedContent = renderedContent.replace(placeholder, imageHtml)
//       })
//     }

//     return renderedContent
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto space-y-8">
//       <Card className="shadow-md">
//         <CardHeader className="pb-4">
//           <CardTitle className="text-2xl">AI Content Generator</CardTitle>
//           <CardDescription>Enter a keyword to search and generate SEO-optimized content</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="relative col-span-1 md:col-span-2">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <Input
//                 type="text"
//                 placeholder="Enter keyword or topic..."
//                 value={keyword}
//                 onChange={(e) => setKeyword(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="pl-10"
//               />
//             </div>

//             <Select value={contentType} onValueChange={setContentType}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Content Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="blog">Blog Post</SelectItem>
//                 <SelectItem value="article">Article</SelectItem>
//                 <SelectItem value="product">Product Description</SelectItem>
//                 <SelectItem value="social">Social Media</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={contentLength} onValueChange={setContentLength}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Content Length" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="short">Short</SelectItem>
//                 <SelectItem value="medium">Medium</SelectItem>
//                 <SelectItem value="long">Long</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={country} onValueChange={setCountry}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Search Country" />
//               </SelectTrigger>
//               <SelectContent>
//                 {COUNTRIES.map((country) => (
//                   <SelectItem key={country.value} value={country.value}>
//                     {country.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {promptTemplates && promptTemplates.length > 0 ? (
//               <Select value={promptTemplateId} onValueChange={setPromptTemplateId}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Prompt Template" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="default">Default Template</SelectItem>
//                   {promptTemplates.map((template) => (
//                     <SelectItem key={template._id} value={template._id}>
//                       {template.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             ) : (
//               <Select disabled value="default" onValueChange={() => {}}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Prompt Templates Unavailable" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="default">Default Template</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={handleGenerate} disabled={isLoading || !keyword.trim()} className="flex-1">
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Searching & Generating...
//                 </>
//               ) : (
//                 <>
//                   <FileText className="mr-2 h-4 w-4" />
//                   Generate Content
//                 </>
//               )}
//             </Button>

//             <Button onClick={handleViewHistory} variant="outline">
//               View History
//             </Button>
//           </div>

//           {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}
//         </CardContent>
//       </Card>

//       {result && (
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="content">Content</TabsTrigger>
//             <TabsTrigger value="search">Search Results</TabsTrigger>
//             <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
//             <TabsTrigger value="affiliate">Affiliate Links</TabsTrigger>
//           </TabsList>

//           <TabsContent value="content">
//             <Card className="w-full">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="text-2xl font-bold">{result.title}</CardTitle>
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="outline" className="ml-2">
//                       SEO Optimized
//                     </Badge>
//                     {isEditing ? (
//                       <Button onClick={handleSave} size="sm">
//                         <Save className="w-4 h-4 mr-2" />
//                         Save
//                       </Button>
//                     ) : (
//                       <Button onClick={handleEdit} size="sm">
//                         <Edit2 className="w-4 h-4 mr-2" />
//                         Edit
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {isEditing ? (
//                   <Textarea
//                     value={editedContent}
//                     onChange={(e) => setEditedContent(e.target.value)}
//                     className="w-full h-[500px]"
//                   />
//                 ) : (
//                   <div
//                     className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
//                     dangerouslySetInnerHTML={{
//                       __html: renderContent(result.content, result.imageResults),
//                     }}
//                   />
//                 )}
//               </CardContent>
//               <CardFooter className="flex justify-between border-t pt-6">
//                 <p className="text-sm text-gray-500">
//                   Generated based on search results for "{keyword}" in{" "}
//                   {COUNTRIES.find((c) => c.value === country)?.label}
//                 </p>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     navigator.clipboard.writeText(result.content)
//                     alert("Content copied to clipboard!")
//                   }}
//                 >
//                   Copy Content
//                 </Button>
//               </CardFooter>
//             </Card>
//           </TabsContent>

//           <TabsContent value="search" className="space-y-4">
//             <h3 className="text-lg font-medium">
//               Top 10 search results for "{keyword}" in {COUNTRIES.find((c) => c.value === country)?.label}
//             </h3>

//             <div className="grid gap-4">
//               {result.searchResults.map((result, index) => (
//                 <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg font-medium line-clamp-2">{result.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="pb-2">
//                     <p className="text-sm text-gray-600 line-clamp-3">{result.snippet}</p>
//                   </CardContent>
//                   <CardFooter className="pt-0 flex justify-between items-center">
//                     <div className="flex items-center text-xs text-gray-500">
//                       <LinkIcon className="mr-1 h-3 w-3" />
//                       <span className="truncate max-w-[200px]">{result.displayLink}</span>
//                     </div>
//                     <a
//                       href={result.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
//                     >
//                       Visit <ExternalLink className="ml-1 h-3 w-3" />
//                     </a>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="seo" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>SEO Analysis</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <dl className="grid grid-cols-2 gap-4">
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Word Count</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.wordCount}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Keyword Density</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.keywordDensity}%</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Headings Count</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.headingsCount}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Paragraph Count</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.paragraphCount}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Avg. Sentence Length</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.averageSentenceLength} words</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Readability Score</dt>
//                     <dd className="text-lg font-semibold">{result.readabilityScore}</dd>
//                   </div>
//                 </dl>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="affiliate" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Affiliate Link Suggestions</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2">
//                   {result.affiliateLinks.map((link, index) => (
//                     <li key={index}>
//                       <a
//                         href={link.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:text-blue-800 flex items-center"
//                       >
//                         {link.name} <ExternalLink className="ml-1 h-3 w-3" />
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       )}
//     </div>
//   )
// }




// "use client"

// import { CardFooter } from "@/components/ui/card"
// import { useState } from "react"
// import { Search, Loader2, FileText, LinkIcon, ExternalLink, Edit2, Save } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { updateContent, saveContent } from "@/lib/actions"
// import { useRouter } from "next/navigation"

// // Country options for search
// const COUNTRIES = [
//   { value: "us", label: "United States" },
//   { value: "gb", label: "United Kingdom" },
//   { value: "ca", label: "Canada" },
//   { value: "au", label: "Australia" },
//   { value: "in", label: "India" },
//   { value: "de", label: "Germany" },
//   { value: "fr", label: "France" },
//   { value: "jp", label: "Japan" },
//   { value: "br", label: "Brazil" },
//   { value: "mx", label: "Mexico" },
// ]

// export default function ContentGenerator({ promptTemplates = [] }) {
//   const router = useRouter()
//   const [keyword, setKeyword] = useState("")
//   const [contentType, setContentType] = useState("blog")
//   const [contentLength, setContentLength] = useState("medium")
//   const [country, setCountry] = useState("us")
//   const [promptTemplateId, setPromptTemplateId] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [activeTab, setActiveTab] = useState("content")
//   const [result, setResult] = useState(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [editedContent, setEditedContent] = useState("")

//   // Add these helper functions
//   const [statusMessage, setStatusMessage] = useState("")

//   // Helper function to perform SEO analysis
//   const performSEOAnalysis = (content, keyword) => {
//     const wordCount = content.split(/\s+/).length
//     const keywordDensity = ((content.toLowerCase().split(keyword.toLowerCase()).length - 1) / wordCount) * 100
//     const headingsCount = (content.match(/^#+\s/gm) || []).length
//     const paragraphCount = (content.match(/\n\n/g) || []).length + 1
//     const averageSentenceLength =
//       content.split(/[.!?]+\s/).reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0) /
//       (content.match(/[.!?]+/g) || []).length

//     return {
//       wordCount,
//       keywordDensity: keywordDensity.toFixed(2),
//       headingsCount,
//       paragraphCount,
//       averageSentenceLength: averageSentenceLength.toFixed(1),
//     }
//   }

//   // Helper function to calculate readability score
//   const calculateReadabilityScore = (content) => {
//     const sentences = content.split(/[.!?]+\s/).length
//     const words = content.split(/\s+/).length
//     const syllables = content.split(/\s+/).reduce((count, word) => {
//       return count + (word.match(/[aeiou]/gi) || []).length
//     }, 0)

//     const fleschKincaid = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
//     return Math.max(0, Math.min(100, fleschKincaid)).toFixed(1)
//   }

//   // Helper function to generate affiliate links
//   const generateAffiliateLinks = (keyword) => {
//     return [
//       { name: "Amazon", url: `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=youraffiliateid` },
//       {
//         name: "eBay",
//         url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}&campid=youraffiliateid`,
//       },
//     ]
//   }

//   // Helper function to save content to database
//   const saveContentToDatabase = async (content) => {
//     try {
//       // Call your server action to save content
//       await saveContent({
//         keyword,
//         contentType,
//         contentLength,
//         country,
//         title: content.title,
//         content: content.content,
//         seoAnalysis: content.seoAnalysis,
//         readabilityScore: content.readabilityScore,
//         affiliateLinks: content.affiliateLinks,
//         searchResults: content.searchResults,
//         imageResults: content.imageResults,
//       })

//       // Refresh router to update history
//       router.refresh()
//     } catch (error) {
//       console.error("Error saving content to database:", error)
//     }
//   }

//   // Helper function to generate fallback content
//   const generateFallbackContent = (keyword, contentType) => {
//     const title = `${keyword} ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`

//     // Create more substantial fallback content
//     const content = `# ${title}

// ## Introduction
// This is a comprehensive ${contentType} about ${keyword}. We'll explore the key aspects, benefits, and important considerations related to this topic.

// ## What is ${keyword}?
// ${keyword} refers to an important concept that has gained significant attention in recent years. Understanding its fundamentals is essential for anyone interested in this field.

// ## Key Benefits
// - Improved efficiency and productivity
// - Enhanced user experience
// - Better outcomes and results
// - Long-term sustainability

// ## Best Practices
// When working with ${keyword}, it's important to follow these best practices:
// 1. Research thoroughly before implementation
// 2. Consult with experts in the field
// 3. Test different approaches
// 4. Measure results and iterate

// ## Common Challenges
// Some challenges you might encounter include:
// - Limited resources
// - Technical complexity
// - Changing requirements
// - Integration issues

// ## Conclusion
// ${keyword} offers significant potential for those who understand how to leverage it effectively. By following the guidelines outlined in this ${contentType}, you'll be well-positioned to achieve success.
// `

//     return {
//       title,
//       content,
//       seoAnalysis: {
//         wordCount: 200,
//         keywordDensity: "2.5",
//         headingsCount: 6,
//         paragraphCount: 8,
//         averageSentenceLength: "15.0",
//       },
//       readabilityScore: "75.0",
//       affiliateLinks: [
//         { name: "Amazon", url: `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=youraffiliateid` },
//       ],
//       searchResults: [],
//       imageResults: [],
//     }
//   }

//   // Update the handleGenerate function in content-generator.jsx
//   const handleGenerate = async () => {
//     if (!keyword.trim()) return

//     setIsLoading(true)
//     setError(null)
//     setResult(null)

//     try {
//       // Set up event source for streaming response
//       const eventSource = new EventSource(
//         `/api/google-content?keyword=${encodeURIComponent(keyword)}&contentType=${contentType}&contentLength=${contentLength}&country=${country}&promptTemplateId=${promptTemplateId || ""}`,
//       )

//       // Handle different stages of generation
//       eventSource.onmessage = (event) => {
//         const data = JSON.parse(event.data)

//         switch (data.status) {
//           case "searching":
//             setStatusMessage("Searching Google for relevant content...")
//             break
//           case "analyzing":
//             setStatusMessage("Analyzing search results...")
//             break
//           case "generating":
//             setStatusMessage("Generating high-quality content...")
//             break
//           case "complete":
//             // Content generation complete
//             eventSource.close()
//             setIsLoading(false)
//             setStatusMessage("")

//             // Process the generated content
//             const generatedContent = data.content
//             console.log("Generated content:", generatedContent)

//             // Create full result object
//             const fullResult = {
//               ...generatedContent,
//               seoAnalysis: performSEOAnalysis(generatedContent.content, keyword),
//               readabilityScore: calculateReadabilityScore(generatedContent.content),
//               affiliateLinks: generateAffiliateLinks(keyword),
//               searchResults: [], // Will be populated later
//               imageResults: [], // Will be populated later
//             }

//             setResult(fullResult)
//             setEditedContent(fullResult.content)
//             setActiveTab("content")

//             // Save to database in the background
//             saveContentToDatabase(fullResult)
//             break
//           case "error":
//             eventSource.close()
//             setIsLoading(false)
//             setStatusMessage("")
//             setError(data.error || "An error occurred during content generation")
//             break
//         }
//       }

//       // Handle errors
//       eventSource.onerror = (error) => {
//         console.error("EventSource error:", error)
//         eventSource.close()
//         setIsLoading(false)
//         setStatusMessage("")
//         setError("Connection error. Please try again.")

//         // Generate fallback content
//         const fallbackContent = generateFallbackContent(keyword, contentType)
//         setResult(fallbackContent)
//         setEditedContent(fallbackContent.content)
//         setActiveTab("content")
//       }
//     } catch (error) {
//       console.error("Error generating content:", error)
//       setIsLoading(false)
//       setError(error.message || "Failed to generate content. Please try again.")
//     }
//   }

//   const handleEdit = () => {
//     setIsEditing(true)
//   }

//   const handleSave = async () => {
//     setIsLoading(true)
//     try {
//       const updatedContent = await updateContent({
//         id: result._id,
//         content: editedContent,
//       })
//       setResult({ ...result, content: updatedContent.content })
//       setIsEditing(false)
//     } catch (error) {
//       console.error("Error updating content:", error)
//       setError("Failed to update content. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleViewHistory = () => {
//     router.push("/history")
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleGenerate()
//     }
//   }

//   const renderContent = (content, images) => {
//     if (!content) return ""

//     let renderedContent = content
//       .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
//       .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
//       .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
//       .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-3 mb-2">$1</h4>')
//       .replace(/\n\n/g, '</p><p class="mb-4">')
//       .replace(/\n/g, "<br/>")
//       .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
//       .replace(/\*(.+?)\*/g, "<em>$1</em>")

//     if (images && images.length > 0) {
//       images.forEach((image, index) => {
//         const placeholder = `[IMAGE${index + 1}]`
//         const imageHtml = `
//           <figure class="my-4">
//             <img src="${image.thumbnail}" alt="${image.title}" class="w-full h-auto rounded-lg shadow-md" />
//             <figcaption class="text-sm text-gray-500 mt-2">${image.title}</figcaption>
//           </figure>
//         `
//         renderedContent = renderedContent.replace(placeholder, imageHtml)
//       })
//     }

//     return renderedContent
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto space-y-8">
//       <Card className="shadow-md">
//         <CardHeader className="pb-4">
//           <CardTitle className="text-2xl">AI Content Generator</CardTitle>
//           <CardDescription>Enter a keyword to search and generate SEO-optimized content</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="relative col-span-1 md:col-span-2">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <Input
//                 type="text"
//                 placeholder="Enter keyword or topic..."
//                 value={keyword}
//                 onChange={(e) => setKeyword(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="pl-10"
//               />
//             </div>

//             <Select value={contentType} onValueChange={setContentType}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Content Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="blog">Blog Post</SelectItem>
//                 <SelectItem value="article">Article</SelectItem>
//                 <SelectItem value="product">Product Description</SelectItem>
//                 <SelectItem value="social">Social Media</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={contentLength} onValueChange={setContentLength}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Content Length" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="short">Short</SelectItem>
//                 <SelectItem value="medium">Medium</SelectItem>
//                 <SelectItem value="long">Long</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={country} onValueChange={setCountry}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Search Country" />
//               </SelectTrigger>
//               <SelectContent>
//                 {COUNTRIES.map((country) => (
//                   <SelectItem key={country.value} value={country.value}>
//                     {country.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {promptTemplates && promptTemplates.length > 0 ? (
//               <Select value={promptTemplateId} onValueChange={setPromptTemplateId}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Prompt Template" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="default">Default Template</SelectItem>
//                   {promptTemplates.map((template) => (
//                     <SelectItem key={template._id} value={template._id}>
//                       {template.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             ) : (
//               <Select disabled value="default" onValueChange={() => {}}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Prompt Templates Unavailable" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="default">Default Template</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={handleGenerate} disabled={isLoading || !keyword.trim()} className="flex-1">
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   {statusMessage || "Searching & Generating..."}
//                 </>
//               ) : (
//                 <>
//                   <FileText className="mr-2 h-4 w-4" />
//                   Generate Content
//                 </>
//               )}
//             </Button>

//             <Button onClick={handleViewHistory} variant="outline">
//               View History
//             </Button>
//           </div>

//           {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}
//         </CardContent>
//       </Card>

//       {result && (
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="content">Content</TabsTrigger>
//             <TabsTrigger value="search">Search Results</TabsTrigger>
//             <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
//             <TabsTrigger value="affiliate">Affiliate Links</TabsTrigger>
//           </TabsList>

//           <TabsContent value="content">
//             <Card className="w-full">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="text-2xl font-bold">{result.title}</CardTitle>
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="outline" className="ml-2">
//                       SEO Optimized
//                     </Badge>
//                     {isEditing ? (
//                       <Button onClick={handleSave} size="sm">
//                         <Save className="w-4 h-4 mr-2" />
//                         Save
//                       </Button>
//                     ) : (
//                       <Button onClick={handleEdit} size="sm">
//                         <Edit2 className="w-4 h-4 mr-2" />
//                         Edit
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {isEditing ? (
//                   <Textarea
//                     value={editedContent}
//                     onChange={(e) => setEditedContent(e.target.value)}
//                     className="w-full h-[500px]"
//                   />
//                 ) : (
//                   <div
//                     className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
//                     dangerouslySetInnerHTML={{
//                       __html: renderContent(result.content, result.imageResults),
//                     }}
//                   />
//                 )}
//               </CardContent>
//               <CardFooter className="flex justify-between border-t pt-6">
//                 <p className="text-sm text-gray-500">
//                   Generated based on search results for "{keyword}" in{" "}
//                   {COUNTRIES.find((c) => c.value === country)?.label}
//                 </p>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     navigator.clipboard.writeText(result.content)
//                     alert("Content copied to clipboard!")
//                   }}
//                 >
//                   Copy Content
//                 </Button>
//               </CardFooter>
//             </Card>
//           </TabsContent>

//           <TabsContent value="search" className="space-y-4">
//             <h3 className="text-lg font-medium">
//               Top 10 search results for "{keyword}" in {COUNTRIES.find((c) => c.value === country)?.label}
//             </h3>

//             <div className="grid gap-4">
//               {result.searchResults.map((result, index) => (
//                 <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-lg font-medium line-clamp-2">{result.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="pb-2">
//                     <p className="text-sm text-gray-600 line-clamp-3">{result.snippet}</p>
//                   </CardContent>
//                   <CardFooter className="pt-0 flex justify-between items-center">
//                     <div className="flex items-center text-xs text-gray-500">
//                       <LinkIcon className="mr-1 h-3 w-3" />
//                       <span className="truncate max-w-[200px]">{result.displayLink}</span>
//                     </div>
//                     <a
//                       href={result.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
//                     >
//                       Visit <ExternalLink className="ml-1 h-3 w-3" />
//                     </a>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="seo" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>SEO Analysis</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <dl className="grid grid-cols-2 gap-4">
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Word Count</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.wordCount}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Keyword Density</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.keywordDensity}%</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Headings Count</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.headingsCount}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Paragraph Count</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.paragraphCount}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Avg. Sentence Length</dt>
//                     <dd className="text-lg font-semibold">{result.seoAnalysis.averageSentenceLength} words</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Readability Score</dt>
//                     <dd className="text-lg font-semibold">{result.readabilityScore}</dd>
//                   </div>
//                 </dl>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="affiliate" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Affiliate Link Suggestions</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2">
//                   {result.affiliateLinks.map((link, index) => (
//                     <li key={index}>
//                       <a
//                         href={link.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:text-blue-800 flex items-center"
//                       >
//                         {link.name} <ExternalLink className="ml-1 h-3 w-3" />
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       )}
//     </div>
//   )
// }


"use client"

import { CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { Search, Loader2, FileText, LinkIcon, ExternalLink, Edit2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateContent, createContent } from "@/lib/actions"
import { useRouter } from "next/navigation"

// Country options for search
const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "in", label: "India" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
]

export default function ContentGenerator({ promptTemplates = [] }) {
  const router = useRouter()
  const [keyword, setKeyword] = useState("")
  const [contentType, setContentType] = useState("blog")
  const [contentLength, setContentLength] = useState("medium")
  const [country, setCountry] = useState("us")
  const [promptTemplateId, setPromptTemplateId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("content")
  const [result, setResult] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")

  // Add these helper functions
  const [statusMessage, setStatusMessage] = useState("")

  // Helper function to perform SEO analysis
  const performSEOAnalysis = (content, keyword) => {
    const wordCount = content.split(/\s+/).length
    const keywordDensity = ((content.toLowerCase().split(keyword.toLowerCase()).length - 1) / wordCount) * 100
    const headingsCount = (content.match(/^#+\s/gm) || []).length
    const paragraphCount = (content.match(/\n\n/g) || []).length + 1
    const averageSentenceLength =
      content.split(/[.!?]+\s/).reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0) /
      (content.match(/[.!?]+/g) || []).length

    return {
      wordCount,
      keywordDensity: keywordDensity.toFixed(2),
      headingsCount,
      paragraphCount,
      averageSentenceLength: averageSentenceLength.toFixed(1),
    }
  }

  // Helper function to calculate readability score
  const calculateReadabilityScore = (content) => {
    const sentences = content.split(/[.!?]+\s/).length
    const words = content.split(/\s+/).length
    const syllables = content.split(/\s+/).reduce((count, word) => {
      return count + (word.match(/[aeiou]/gi) || []).length
    }, 0)

    const fleschKincaid = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    return Math.max(0, Math.min(100, fleschKincaid)).toFixed(1)
  }

  // Helper function to generate affiliate links
  const generateAffiliateLinks = (keyword) => {
    return [
      { name: "Amazon", url: `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=youraffiliateid` },
      {
        name: "eBay",
        url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}&campid=youraffiliateid`,
      },
    ]
  }

  // Helper function to save content to database
  const saveContentToDatabase = async (content) => {
    try {
      // Call your server action to save content
      await createContent({
        keyword,
        contentType,
        contentLength,
        country,
        title: content.title,
        content: content.content,
        seoAnalysis: content.seoAnalysis,
        readabilityScore: content.readabilityScore,
        affiliateLinks: content.affiliateLinks,
        searchResults: content.searchResults,
        imageResults: content.imageResults,
      })

      // Refresh router to update history
      router.refresh()
    } catch (error) {
      console.error("Error saving content to database:", error)
    }
  }

  // Helper function to generate fallback content
  const generateFallbackContent = (keyword, contentType) => {
    const title = `${keyword} ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`

    // Create more substantial fallback content
    const content = `# ${title}

## Introduction
This is a comprehensive ${contentType} about ${keyword}. We'll explore the key aspects, benefits, and important considerations related to this topic.

## What is ${keyword}?
${keyword} refers to an important concept that has gained significant attention in recent years. Understanding its fundamentals is essential for anyone interested in this field.

## Key Benefits
- Improved efficiency and productivity
- Enhanced user experience
- Better outcomes and results
- Long-term sustainability

## Best Practices
When working with ${keyword}, it's important to follow these best practices:
1. Research thoroughly before implementation
2. Consult with experts in the field
3. Test different approaches
4. Measure results and iterate

## Common Challenges
Some challenges you might encounter include:
- Limited resources
- Technical complexity
- Changing requirements
- Integration issues

## Conclusion
${keyword} offers significant potential for those who understand how to leverage it effectively. By following the guidelines outlined in this ${contentType}, you'll be well-positioned to achieve success.
`

    return {
      title,
      content,
      seoAnalysis: {
        wordCount: 200,
        keywordDensity: "2.5",
        headingsCount: 6,
        paragraphCount: 8,
        averageSentenceLength: "15.0",
      },
      readabilityScore: "75.0",
      affiliateLinks: [
        { name: "Amazon", url: `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=youraffiliateid` },
      ],
      searchResults: [],
      imageResults: [],
    }
  }

  // Update the handleGenerate function in content-generator.jsx
  const handleGenerate = async () => {
    if (!keyword.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)
    setStatusMessage("Generating content...")

    try {
      // Use regular fetch with a longer timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch("/api/google-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword,
          contentType,
          contentLength,
          country,
          promptTemplateId: promptTemplateId || "",
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Check if we got an error
      if (data.error) {
        setError(data.error)

        // If we have fallback content, use it
        if (data.fallbackContent) {
          setResult(data.fallbackContent)
          setEditedContent(data.fallbackContent.content)
          setActiveTab("content")
          alert(
            "The content generation took too long. We've provided simplified content instead. You can edit it as needed.",
          )
        }
        return
      }

      // Process the generated content
      setResult(data)
      setEditedContent(data.content)
      setActiveTab("content")

      // Save to database in the background
      saveContentToDatabase(data)
    } catch (error) {
      console.error("Error generating content:", error)
      setError(error.message || "Failed to generate content. Please try again.")

      // Generate fallback content
      const fallbackContent = generateFallbackContent(keyword, contentType)
      setResult(fallbackContent)
      setEditedContent(fallbackContent.content)
      setActiveTab("content")
    } finally {
      setIsLoading(false)
      setStatusMessage("")
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const updatedContent = await updateContent({
        id: result._id,
        content: editedContent,
      })
      setResult({ ...result, content: updatedContent.content })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating content:", error)
      setError("Failed to update content. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewHistory = () => {
    router.push("/history")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleGenerate()
    }
  }

  const renderContent = (content, images) => {
    if (!content) return ""

    // First convert markdown to HTML
    let renderedContent = content
      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-3 mb-2">$1</h4>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br/>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")

    // Process image placeholders safely
    if (images && images.length > 0) {
      // Instead of using regex replacement which can cause issues with large strings,
      // we'll split the content and join it with images
      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        const placeholder = `[IMAGE${i + 1}]`

        // Create image HTML
        const imageHtml = `
        <figure class="my-4">
          <img src="${image.thumbnail}" alt="${image.title}" class="w-full h-auto rounded-lg shadow-md" />
          <figcaption class="text-sm text-gray-500 mt-2">${image.title}</figcaption>
        </figure>
      `

        // Split and join to avoid regex replacement issues
        const parts = renderedContent.split(placeholder)
        if (parts.length > 1) {
          renderedContent = parts.join(imageHtml)
        }
      }
    }

    return renderedContent
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">AI Content Generator</CardTitle>
          <CardDescription>Enter a keyword to search and generate SEO-optimized content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative col-span-1 md:col-span-2">
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

            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog Post</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="product">Product Description</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
              </SelectContent>
            </Select>

            <Select value={contentLength} onValueChange={setContentLength}>
              <SelectTrigger>
                <SelectValue placeholder="Content Length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>

            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Search Country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {promptTemplates && promptTemplates.length > 0 ? (
              <Select value={promptTemplateId} onValueChange={setPromptTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Prompt Template" />
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
            ) : (
              <Select disabled value="default" onValueChange={() => {}}>
                <SelectTrigger>
                  <SelectValue placeholder="Prompt Templates Unavailable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Template</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerate} disabled={isLoading || !keyword.trim()} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {statusMessage || "Searching & Generating..."}
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>

            <Button onClick={handleViewHistory} variant="outline">
              View History
            </Button>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}
        </CardContent>
      </Card>

      {result && (
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
                  <CardTitle className="text-2xl font-bold">{result.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="ml-2">
                      SEO Optimized
                    </Badge>
                    {isEditing ? (
                      <Button onClick={handleSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    ) : (
                      <Button onClick={handleEdit} size="sm">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-[500px]"
                  />
                ) : (
                  <div
                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: renderContent(result.content, result.imageResults),
                    }}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <p className="text-sm text-gray-500">
                  Generated based on search results for "{keyword}" in{" "}
                  {COUNTRIES.find((c) => c.value === country)?.label}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(result.content)
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
              Search results for "{keyword}" in {COUNTRIES.find((c) => c.value === country)?.label}
              {result.searchResults && ` (${result.searchResults.length} results)`}
            </h3>

            <div className="grid gap-4">
              {result.searchResults &&
                result.searchResults.map((result, index) => (
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
                    <dd className="text-lg font-semibold">{result.seoAnalysis.wordCount}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Keyword Density</dt>
                    <dd className="text-lg font-semibold">{result.seoAnalysis.keywordDensity}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Headings Count</dt>
                    <dd className="text-lg font-semibold">{result.seoAnalysis.headingsCount}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Paragraph Count</dt>
                    <dd className="text-lg font-semibold">{result.seoAnalysis.paragraphCount}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Avg. Sentence Length</dt>
                    <dd className="text-lg font-semibold">{result.seoAnalysis.averageSentenceLength} words</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Readability Score</dt>
                    <dd className="text-lg font-semibold">{result.readabilityScore}</dd>
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
                  {result.affiliateLinks.map((link, index) => (
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
      )}
    </div>
  )
}

