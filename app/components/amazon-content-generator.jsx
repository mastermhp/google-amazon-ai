// "use client"
// import { useState, useEffect } from "react"
// import { Loader2, FileText, Edit, Check, Copy, Download } from "lucide-react"
// import SeoMetrics from "./seo-metrics"
// import ReactMarkdown from "react-markdown"
// import { saveAmazonReviewAction, getAmazonPromptTemplatesAction } from "@/lib/actions"
// import { useRouter } from "next/navigation"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"

// export default function AmazonContentGenerator({ products }) {
//   const router = useRouter()
//   const [keywords, setKeywords] = useState("")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [content, setContent] = useState("")
//   const [seoMetrics, setSeoMetrics] = useState(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [editableContent, setEditableContent] = useState("")
//   const [copySuccess, setCopySuccess] = useState(false)
//   const [promptTemplates, setPromptTemplates] = useState([])
//   const [promptTemplateId, setPromptTemplateId] = useState("default")
//   const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
//   const [activeTab, setActiveTab] = useState("content")

//   useEffect(() => {
//     // Load prompt templates
//     const loadTemplates = async () => {
//       try {
//         const templates = await getAmazonPromptTemplatesAction()
//         setPromptTemplates(templates)
//       } catch (error) {
//         console.error("Error loading prompt templates:", error)
//       } finally {
//         setIsLoadingTemplates(false)
//       }
//     }

//     loadTemplates()
//   }, [])

//   const generateContent = async () => {
//     if (!products || products.length === 0) {
//       alert("Please search for products first")
//       return
//     }

//     setIsGenerating(true)
//     setActiveTab("content")

//     try {
//       const response = await fetch("/api/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           products,
//           keywords,
//           promptTemplateId: promptTemplateId !== "default" ? promptTemplateId : undefined,
//         }),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.error || "Failed to generate content")
//       }

//       const data = await response.json()
//       setContent(data.content)
//       setEditableContent(data.content)
//       setSeoMetrics(data.seoMetrics)

//       // Save to MongoDB
//       const titleMatch = data.content.match(/^# (.+)$/m)
//       const title = titleMatch ? titleMatch[1] : `Amazon Product Review`

//       await saveAmazonReviewAction({
//         title,
//         content: data.content,
//         products,
//         keywords: keywords || "best products, product comparison, product review",
//         seoMetrics: data.seoMetrics,
//         promptTemplateId: promptTemplateId !== "default" ? promptTemplateId : undefined,
//       })

//       // Refresh the router to update any history views
//       router.refresh()
//     } catch (error) {
//       console.error("Error generating content:", error)
//       alert(`Error: ${error.message}`)
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleCopyContent = () => {
//     navigator.clipboard.writeText(isEditing ? editableContent : content)
//     setCopySuccess(true)
//     setTimeout(() => setCopySuccess(false), 2000)
//   }

//   const handleDownloadContent = () => {
//     const element = document.createElement("a")
//     const file = new Blob([isEditing ? editableContent : content], { type: "text/markdown" })
//     element.href = URL.createObjectURL(file)
//     element.download = `product-review-${new Date().toISOString().split("T")[0]}.md`
//     document.body.appendChild(element)
//     element.click()
//     document.body.removeChild(element)
//   }

//   const handleSaveEdit = () => {
//     setContent(editableContent)
//     setIsEditing(false)
//     // Recalculate SEO metrics after edit
//     const updatedSeoMetrics = {
//       ...seoMetrics,
//       wordCount: editableContent.split(/\s+/).length,
//     }
//     setSeoMetrics(updatedSeoMetrics)
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto space-y-8">
//       <Card className="shadow-md">
//         <CardHeader className="pb-4">
//           <CardTitle className="text-2xl">Generate Amazon Review</CardTitle>
//           <CardDescription>Create a comprehensive review of the selected products</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label htmlFor="keywords" className="text-sm font-medium text-gray-700">
//                 Target Keywords (comma separated)
//               </label>
//               <input
//                 id="keywords"
//                 type="text"
//                 value={keywords}
//                 onChange={(e) => setKeywords(e.target.value)}
//                 placeholder="best products, product comparison, product review"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 disabled={isGenerating}
//               />
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="promptTemplate" className="text-sm font-medium text-gray-700">
//                 Prompt Template
//               </label>
//               <Select
//                 value={promptTemplateId}
//                 onValueChange={setPromptTemplateId}
//                 disabled={isLoadingTemplates || isGenerating}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a template" />
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
//               <div className="mt-1 text-xs text-gray-500">
//                 <Link href="/admin/amazon-prompts">
//                   <span className="text-blue-600 hover:underline">Manage templates</span>
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <Button onClick={generateContent} disabled={isGenerating || products.length === 0} className="w-full">
//             {isGenerating ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <FileText className="mr-2 h-4 w-4" />
//                 Generate Review
//               </>
//             )}
//           </Button>
//         </CardContent>
//       </Card>

//       {content && (
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="content">Content</TabsTrigger>
//             <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
//           </TabsList>

//           <TabsContent value="content">
//             <Card className="w-full">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="text-2xl font-bold">
//                     {content.match(/^# (.+)$/m)?.[1] || "Amazon Product Review"}
//                   </CardTitle>
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="outline" className="ml-2">
//                       SEO Optimized
//                     </Badge>
//                     {isEditing ? (
//                       <Button onClick={handleSaveEdit} size="sm">
//                         <Check className="w-4 h-4 mr-2" />
//                         Save
//                       </Button>
//                     ) : (
//                       <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
//                         <Edit className="w-4 h-4 mr-2" />
//                         Edit
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {isEditing ? (
//                   <textarea
//                     value={editableContent}
//                     onChange={(e) => setEditableContent(e.target.value)}
//                     className="w-full h-[500px] p-4 border border-gray-300 rounded-md font-mono text-sm"
//                   />
//                 ) : (
//                   <div className="prose max-w-none dark:prose-invert">
//                     <ReactMarkdown>{content}</ReactMarkdown>
//                   </div>
//                 )}
//               </CardContent>
//               <CardFooter className="flex justify-between border-t pt-6">
//                 <p className="text-sm text-gray-500">
//                   Generated for {products.length} products with keywords:{" "}
//                   {keywords || "best products, product comparison"}
//                 </p>
//                 <div className="flex space-x-2">
//                   <Button variant="outline" onClick={handleCopyContent} className="flex items-center">
//                     {copySuccess ? (
//                       <>
//                         <Check className="mr-2 h-4 w-4" />
//                         Copied!
//                       </>
//                     ) : (
//                       <>
//                         <Copy className="mr-2 h-4 w-4" />
//                         Copy
//                       </>
//                     )}
//                   </Button>
//                   <Button variant="outline" onClick={handleDownloadContent} className="flex items-center">
//                     <Download className="mr-2 h-4 w-4" />
//                     Download
//                   </Button>
//                 </div>
//               </CardFooter>
//             </Card>
//           </TabsContent>

//           <TabsContent value="seo">{seoMetrics && <SeoMetrics metrics={seoMetrics} />}</TabsContent>
//         </Tabs>
//       )}
//     </div>
//   )
// }



// "use client"
// import { useState, useEffect } from "react"
// import { Loader2, FileText, Edit, Check, Copy, Download } from "lucide-react"
// import SeoMetrics from "./seo-metrics"
// import { saveAmazonReviewAction, getAmazonPromptTemplatesAction } from "@/lib/actions"
// import { useRouter } from "next/navigation"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"

// export default function AmazonContentGenerator({ products }) {
//   const router = useRouter()
//   const [keywords, setKeywords] = useState("")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [content, setContent] = useState("")
//   const [seoMetrics, setSeoMetrics] = useState(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [editableContent, setEditableContent] = useState("")
//   const [copySuccess, setCopySuccess] = useState(false)
//   const [promptTemplates, setPromptTemplates] = useState([])
//   const [promptTemplateId, setPromptTemplateId] = useState("default")
//   const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
//   const [activeTab, setActiveTab] = useState("content")

//   useEffect(() => {
//     // Load prompt templates
//     const loadTemplates = async () => {
//       try {
//         const templates = await getAmazonPromptTemplatesAction()
//         setPromptTemplates(templates)
//       } catch (error) {
//         console.error("Error loading prompt templates:", error)
//       } finally {
//         setIsLoadingTemplates(false)
//       }
//     }

//     loadTemplates()
//   }, [])

//   const generateContent = async () => {
//     if (!products || products.length === 0) {
//       alert("Please search for products first")
//       return
//     }

//     setIsGenerating(true)
//     setActiveTab("content")

//     try {
//       const response = await fetch("/api/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           products,
//           keywords,
//           promptTemplateId: promptTemplateId !== "default" ? promptTemplateId : undefined,
//         }),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.error || "Failed to generate content")
//       }

//       const data = await response.json()

//       // Add image placeholders to the content
//       let contentWithImages = data.content

//       // Add product image placeholders at appropriate positions in the content
//       products.forEach((product, index) => {
//         // Find a good position to insert the image - after product mentions or at section breaks
//         const productNameMention = new RegExp(`(${product.title.split(" ").slice(0, 3).join("\\s+")})`, "i")
//         const sectionBreak = /\n## /g

//         // Try to find the product name in the content
//         const matches = contentWithImages.match(productNameMention)

//         if (matches && matches.index) {
//           // Find the end of the paragraph where the product is mentioned
//           const paragraphEnd = contentWithImages.indexOf("\n\n", matches.index)
//           if (paragraphEnd !== -1) {
//             // Insert image placeholder after the paragraph
//             const imagePlaceholder = `\n\n[PRODUCT_IMAGE${index + 1}]\n\n`
//             contentWithImages =
//               contentWithImages.substring(0, paragraphEnd) +
//               imagePlaceholder +
//               contentWithImages.substring(paragraphEnd)
//           }
//         } else {
//           // If product name not found, insert after a section break
//           const sections = contentWithImages.split(sectionBreak)
//           if (sections.length > index + 1) {
//             // Insert after a section heading
//             const position = contentWithImages.indexOf(sections[index + 1]) + sections[index + 1].indexOf("\n\n")
//             if (position !== -1) {
//               const imagePlaceholder = `\n\n[PRODUCT_IMAGE${index + 1}]\n\n`
//               contentWithImages =
//                 contentWithImages.substring(0, position) + imagePlaceholder + contentWithImages.substring(position)
//             }
//           }
//         }
//       })

//       setContent(contentWithImages)
//       setEditableContent(contentWithImages)
//       setSeoMetrics(data.seoMetrics)

//       // Save to MongoDB
//       const titleMatch = contentWithImages.match(/^# (.+)$/m)
//       const title = titleMatch ? titleMatch[1] : `Amazon Product Review`

//       await saveAmazonReviewAction({
//         title,
//         content: contentWithImages,
//         products,
//         keywords: keywords || "best products, product comparison, product review",
//         seoMetrics: data.seoMetrics,
//         promptTemplateId: promptTemplateId !== "default" ? promptTemplateId : undefined,
//       })

//       // Refresh the router to update any history views
//       router.refresh()
//     } catch (error) {
//       console.error("Error generating content:", error)
//       alert(`Error: ${error.message}`)
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleCopyContent = () => {
//     navigator.clipboard.writeText(isEditing ? editableContent : content)
//     setCopySuccess(true)
//     setTimeout(() => setCopySuccess(false), 2000)
//   }

//   const handleDownloadContent = () => {
//     const element = document.createElement("a")
//     const file = new Blob([isEditing ? editableContent : content], { type: "text/markdown" })
//     element.href = URL.createObjectURL(file)
//     element.download = `product-review-${new Date().toISOString().split("T")[0]}.md`
//     document.body.appendChild(element)
//     element.click()
//     document.body.removeChild(element)
//   }

//   const handleSaveEdit = () => {
//     setContent(editableContent)
//     setIsEditing(false)
//     // Recalculate SEO metrics after edit
//     const updatedSeoMetrics = {
//       ...seoMetrics,
//       wordCount: editableContent.split(/\s+/).length,
//     }
//     setSeoMetrics(updatedSeoMetrics)
//   }

//   const renderContent = (content) => {
//     if (!content) return ""

//     let renderedContent = content

//     // Replace product image placeholders with actual images
//     products.forEach((product, index) => {
//       const placeholder = `[PRODUCT_IMAGE${index + 1}]`
//       const imageHtml = `
//         <figure class="my-4">
//           <img src="${product.image}" alt="${product.title}" class="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-md" />
//           <figcaption class="text-sm text-gray-500 mt-2">${product.title}</figcaption>
//         </figure>
//       `
//       renderedContent = renderedContent.replace(placeholder, imageHtml)
//     })

//     return renderedContent
//   }

//   return (
//     <div className="w-full max-w-4xl mx-auto space-y-8">
//       <Card className="shadow-md">
//         <CardHeader className="pb-4">
//           <CardTitle className="text-2xl">Generate Amazon Review</CardTitle>
//           <CardDescription>Create a comprehensive review of the selected products</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label htmlFor="keywords" className="text-sm font-medium text-gray-700">
//                 Target Keywords (comma separated)
//               </label>
//               <input
//                 id="keywords"
//                 type="text"
//                 value={keywords}
//                 onChange={(e) => setKeywords(e.target.value)}
//                 placeholder="best products, product comparison, product review"
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 disabled={isGenerating}
//               />
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="promptTemplate" className="text-sm font-medium text-gray-700">
//                 Prompt Template
//               </label>
//               <Select
//                 value={promptTemplateId}
//                 onValueChange={setPromptTemplateId}
//                 disabled={isLoadingTemplates || isGenerating}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a template" />
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
//               <div className="mt-1 text-xs text-gray-500">
//                 <Link href="/admin/amazon-prompts">
//                   <span className="text-blue-600 hover:underline">Manage templates</span>
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <Button onClick={generateContent} disabled={isGenerating || products.length === 0} className="w-full">
//             {isGenerating ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <FileText className="mr-2 h-4 w-4" />
//                 Generate Review
//               </>
//             )}
//           </Button>
//         </CardContent>
//       </Card>

//       {content && (
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="content">Content</TabsTrigger>
//             <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
//           </TabsList>

//           <TabsContent value="content">
//             <Card className="w-full">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="text-2xl font-bold">
//                     {content.match(/^# (.+)$/m)?.[1] || "Amazon Product Review"}
//                   </CardTitle>
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="outline" className="ml-2">
//                       SEO Optimized
//                     </Badge>
//                     {isEditing ? (
//                       <Button onClick={handleSaveEdit} size="sm">
//                         <Check className="w-4 h-4 mr-2" />
//                         Save
//                       </Button>
//                     ) : (
//                       <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
//                         <Edit className="w-4 h-4 mr-2" />
//                         Edit
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {isEditing ? (
//                   <textarea
//                     value={editableContent}
//                     onChange={(e) => setEditableContent(e.target.value)}
//                     className="w-full h-[500px] p-4 border border-gray-300 rounded-md font-mono text-sm"
//                   />
//                 ) : (
//                   <div className="prose max-w-none dark:prose-invert">
//                     <div dangerouslySetInnerHTML={{ __html: renderContent(content) }} />
//                   </div>
//                 )}
//               </CardContent>
//               <CardFooter className="flex justify-between border-t pt-6">
//                 <p className="text-sm text-gray-500">
//                   Generated for {products.length} products with keywords:{" "}
//                   {keywords || "best products, product comparison"}
//                 </p>
//                 <div className="flex space-x-2">
//                   <Button variant="outline" onClick={handleCopyContent} className="flex items-center">
//                     {copySuccess ? (
//                       <>
//                         <Check className="mr-2 h-4 w-4" />
//                         Copied!
//                       </>
//                     ) : (
//                       <>
//                         <Copy className="mr-2 h-4 w-4" />
//                         Copy
//                       </>
//                     )}
//                   </Button>
//                   <Button variant="outline" onClick={handleDownloadContent} className="flex items-center">
//                     <Download className="mr-2 h-4 w-4" />
//                     Download
//                   </Button>
//                 </div>
//               </CardFooter>
//             </Card>
//           </TabsContent>

//           <TabsContent value="seo">{seoMetrics && <SeoMetrics metrics={seoMetrics} />}</TabsContent>
//         </Tabs>
//       )}
//     </div>
//   )
// }




"use client"
import React, { useState, useEffect } from "react"
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

      // Add image placeholders to the content
      let contentWithImages = data.content

      // Add product image placeholders at appropriate positions in the content
      products.forEach((product, index) => {
        // Find a good position to insert the image - after product mentions or at section breaks
        const productNameMention = new RegExp(`(${product.title.split(" ").slice(0, 3).join("\\s+")})`, "i")
        const sectionBreak = /\n## /g

        // Try to find the product name in the content
        const matches = contentWithImages.match(productNameMention)

        if (matches && matches.index) {
          // Find the end of the paragraph where the product is mentioned
          const paragraphEnd = contentWithImages.indexOf("\n\n", matches.index)
          if (paragraphEnd !== -1) {
            // Insert image placeholder after the paragraph
            const imagePlaceholder = `\n\n[PRODUCT_IMAGE${index + 1}]\n\n`
            contentWithImages =
              contentWithImages.substring(0, paragraphEnd) +
              imagePlaceholder +
              contentWithImages.substring(paragraphEnd)
          }
        } else {
          // If product name not found, insert after a section break
          const sections = contentWithImages.split(sectionBreak)
          if (sections.length > index + 1) {
            // Insert after a section heading
            const position = contentWithImages.indexOf(sections[index + 1]) + sections[index + 1].indexOf("\n\n")
            if (position !== -1) {
              const imagePlaceholder = `\n\n[PRODUCT_IMAGE${index + 1}]\n\n`
              contentWithImages =
                contentWithImages.substring(0, position) + imagePlaceholder + contentWithImages.substring(position)
            }
          }
        }
      })

      setContent(contentWithImages)
      setEditableContent(contentWithImages)
      setSeoMetrics(data.seoMetrics)

      // Save to MongoDB
      const titleMatch = contentWithImages.match(/^# (.+)$/m)
      const title = titleMatch ? titleMatch[1] : `Amazon Product Review`

      await saveAmazonReviewAction({
        title,
        content: contentWithImages,
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

  // Custom renderer for ReactMarkdown components
  const renderers = {
    // Add custom renderers for markdown elements
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-5 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold mt-3 mb-2">{children}</h4>,
    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">{children}</blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse border border-gray-300">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-gray-300">{children}</tr>,
    th: ({ children }) => <th className="border border-gray-300 px-4 py-2 text-left font-bold">{children}</th>,
    td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
    hr: () => <hr className="my-6 border-t border-gray-300" />,
    code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">{children}</code>,
    pre: ({ children }) => (
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4 font-mono text-sm">{children}</pre>
    ),
  }

  const renderContent = (content) => {
    if (!content) return ""

    // Process the content to replace product image placeholders
    let processedContent = content

    // Replace product image placeholders with custom markers that won't be processed by ReactMarkdown
    products.forEach((product, index) => {
      const placeholder = `[PRODUCT_IMAGE${index + 1}]`
      const marker = `__PRODUCT_IMAGE_${index + 1}__`
      processedContent = processedContent.replace(placeholder, marker)
    })

    // Split content by custom markers to render images between markdown sections
    const contentParts = processedContent.split(/__PRODUCT_IMAGE_\d+__/)
    const imageParts = []

    products.forEach((product, index) => {
      const marker = `__PRODUCT_IMAGE_${index + 1}__`
      if (processedContent.includes(marker)) {
        imageParts.push(
          <figure key={`img-${index}`} className="my-6">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-md mx-auto"
            />
            <figcaption className="text-sm text-gray-500 mt-2 text-center">{product.title}</figcaption>
          </figure>,
        )
      }
    })

    // Combine markdown content and images
    return (
      <>
        {contentParts.map((part, index) => (
          <React.Fragment key={`part-${index}`}>
            <ReactMarkdown components={renderers}>{part}</ReactMarkdown>
            {index < imageParts.length && imageParts[index]}
          </React.Fragment>
        ))}
      </>
    )
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
                  <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
                    {renderContent(content)}
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

