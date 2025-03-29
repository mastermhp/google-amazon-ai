// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import Link from "next/link"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Loader2, ArrowLeft } from "lucide-react"
// import { getAmazonReviewByIdAction } from "@/lib/actions"
// import ReactMarkdown from "react-markdown"

// export default function AmazonReviewDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const [review, setReview] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     if (params.id) {
//       loadReview(params.id)
//     }
//   }, [params.id])

//   const loadReview = async (id) => {
//     setIsLoading(true)
//     try {
//       const data = await getAmazonReviewByIdAction(id)
//       if (!data) {
//         setError("Review not found")
//         return
//       }
//       setReview(data)
//     } catch (error) {
//       console.error("Error loading Amazon review:", error)
//       setError("Failed to load Amazon review")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-8 max-w-4xl flex justify-center items-center min-h-[50vh]">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-8 max-w-4xl">
//         <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-600">
//           <h2 className="text-xl font-bold mb-2">Error</h2>
//           <p>{error}</p>
//           <Button className="mt-4" onClick={() => router.push("/amazon-review/history")}>
//             Back to History
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   if (!review) {
//     return null
//   }

//   return (
//     <div className="container mx-auto py-8 max-w-4xl">
//       <div className="flex justify-between items-center mb-6">
//         <Link href="/amazon-review/history">
//           <Button variant="outline" className="flex items-center">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to History
//           </Button>
//         </Link>
//         <div className="text-sm text-gray-500">Generated: {new Date(review.createdAt).toLocaleString()}</div>
//       </div>

//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">{review.title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="prose max-w-none">
//             <ReactMarkdown>{review.content}</ReactMarkdown>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between border-t pt-6">
//           <p className="text-sm text-gray-500">Keywords: {review.keywords}</p>
//           <Button
//             variant="outline"
//             onClick={() => {
//               navigator.clipboard.writeText(review.content)
//               alert("Content copied to clipboard!")
//             }}
//           >
//             Copy Content
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import Link from "next/link"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Loader2, ArrowLeft } from "lucide-react"
// import { getAmazonReviewByIdAction } from "@/lib/actions"

// export default function AmazonReviewDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const [review, setReview] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     if (params.id) {
//       loadReview(params.id)
//     }
//   }, [params.id])

//   const loadReview = async (id) => {
//     setIsLoading(true)
//     try {
//       const data = await getAmazonReviewByIdAction(id)
//       if (!data) {
//         setError("Review not found")
//         return
//       }
//       setReview(data)
//     } catch (error) {
//       console.error("Error loading Amazon review:", error)
//       setError("Failed to load Amazon review")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const renderContent = (content, products) => {
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

//     // Replace product image placeholders with actual images
//     if (products && products.length > 0) {
//       products.forEach((product, index) => {
//         const placeholder = `[PRODUCT_IMAGE${index + 1}]`
//         const imageHtml = `
//           <figure class="my-4">
//             <img src="${product.image}" alt="${product.title}" class="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-md" />
//             <figcaption class="text-sm text-gray-500 mt-2">${product.title}</figcaption>
//           </figure>
//         `
//         renderedContent = renderedContent.replace(placeholder, imageHtml)
//       })
//     }

//     return renderedContent
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-8 max-w-4xl flex justify-center items-center min-h-[50vh]">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-8 max-w-4xl">
//         <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-600">
//           <h2 className="text-xl font-bold mb-2">Error</h2>
//           <p>{error}</p>
//           <Button className="mt-4" onClick={() => router.push("/amazon-review/history")}>
//             Back to History
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   if (!review) {
//     return null
//   }

//   return (
//     <div className="container mx-auto py-8 max-w-4xl">
//       <div className="flex justify-between items-center mb-6">
//         <Link href="/amazon-review/history">
//           <Button variant="outline" className="flex items-center">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to History
//           </Button>
//         </Link>
//         <div className="text-sm text-gray-500">Generated: {new Date(review.createdAt).toLocaleString()}</div>
//       </div>

//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">{review.title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div
//             className="prose max-w-none dark:prose-invert"
//             dangerouslySetInnerHTML={{
//               __html: renderContent(review.content, review.products),
//             }}
//           />
//         </CardContent>
//         <CardFooter className="flex justify-between border-t pt-6">
//           <p className="text-sm text-gray-500">Keywords: {review.keywords}</p>
//           <Button
//             variant="outline"
//             onClick={() => {
//               navigator.clipboard.writeText(review.content)
//               alert("Content copied to clipboard!")
//             }}
//           >
//             Copy Content
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }




"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import { getAmazonReviewByIdAction } from "@/lib/actions"
import ReactMarkdown from "react-markdown"

export default function AmazonReviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [review, setReview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      loadReview(params.id)
    }
  }, [params.id])

  const loadReview = async (id) => {
    setIsLoading(true)
    try {
      const data = await getAmazonReviewByIdAction(id)
      if (!data) {
        setError("Review not found")
        return
      }
      setReview(data)
    } catch (error) {
      console.error("Error loading Amazon review:", error)
      setError("Failed to load Amazon review")
    } finally {
      setIsLoading(false)
    }
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

  const renderContent = (content, products) => {
    if (!content) return ""

    // Process the content to replace product image placeholders
    let processedContent = content

    // Replace product image placeholders with custom markers that won't be processed by ReactMarkdown
    if (products && products.length > 0) {
      products.forEach((product, index) => {
        const placeholder = `[PRODUCT_IMAGE${index + 1}]`
        const marker = `__PRODUCT_IMAGE_${index + 1}__`
        processedContent = processedContent.replace(placeholder, marker)
      })
    }

    // Split content by custom markers to render images between markdown sections
    const contentParts = processedContent.split(/__PRODUCT_IMAGE_\d+__/)
    const imageParts = []

    if (products && products.length > 0) {
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
    }

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
          <Button className="mt-4" onClick={() => router.push("/amazon-review/history")}>
            Back to History
          </Button>
        </div>
      </div>
    )
  }

  if (!review) {
    return null
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Link href="/amazon-review/history">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
        </Link>
        <div className="text-sm text-gray-500">Generated: {new Date(review.createdAt).toLocaleString()}</div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{review.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
            {renderContent(review.content, review.products)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-gray-500">Keywords: {review.keywords}</p>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(review.content)
              alert("Content copied to clipboard!")
            }}
          >
            Copy Content
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

