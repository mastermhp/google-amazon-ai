// import { NextResponse } from "next/server"
// import { GoogleGenerativeAI } from "@google/generative-ai"

// const apiKey = process.env.GEMINI_API_KEY
// const genAI = new GoogleGenerativeAI(apiKey)

// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// }

// // Update the POST handler to accept a template
// export async function POST(req) {
//   try {
//     const { products, keywords, promptTemplateId } = await req.json()

//     if (!products || products.length === 0) {
//       return NextResponse.json({ error: "Products data is required" }, { status: 400 })
//     }

//     console.log("Generating content for products:", products.length)

//     // Get the template if a promptTemplateId is provided
//     let templateContent = null
//     if (promptTemplateId) {
//       try {
//         // Import the getAmazonPromptTemplateById function
//         const { getAmazonPromptTemplateById } = await import("@/lib/models")
//         const template = await getAmazonPromptTemplateById(promptTemplateId)
//         if (template) {
//           templateContent = template.template
//         }
//       } catch (error) {
//         console.error("Error fetching template:", error)
//       }
//     }

//     // Create the structured prompt
//     const prompt = createPrompt(products, keywords, templateContent)

//     // Generate content
//     const result = await model.generateContent({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//       generationConfig,
//     })

//     const text = result?.response?.text() || "No response generated"

//     // Analyze SEO metrics
//     const seoMetrics = analyzeSeoMetrics(text, keywords)

//     return NextResponse.json({
//       content: text,
//       seoMetrics: seoMetrics,
//     })
//   } catch (error) {
//     console.error("Content Generation Error:", error)
//     return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 })
//   }
// }

// // Update the createPrompt function to use templates and include image placeholders
// function createPrompt(products, keywords, template) {
//   const productDetails = products
//     .map((product, index) => {
//       return `
// Product ${index + 1}: ${product.title}
// Price: ${product.price}
// Rating: ${product.rating || "N/A"} (${product.numRatings || "N/A"} reviews)
// Features: ${product.isPrime ? "Amazon Prime eligible" : "Not Prime eligible"}
// ${product.isBestSeller ? "Bestseller" : ""}
// ${product.isAmazonChoice ? "Amazon's Choice" : ""}
//   `
//     })
//     .join("\n")

//   // If a template is provided, use it with replacements
//   if (template) {
//     return template
//       .replace("{{productDetails}}", productDetails)
//       .replace("{{keywords}}", keywords || "best products, product comparison, product review")
//   }

//   // Otherwise use the default prompt with enhanced styling instructions
//   return `
// You are an expert product reviewer. Create an SEO-friendly blog post comparing these Amazon products:

// ${productDetails}

// Target Keywords: ${keywords || "best products, product comparison, product review"}

// Your blog post should include:
// 1. An engaging introduction about the product category.
// 2. A comparison table of all products with their key features, prices, and ratings.
// 3. Detailed reviews with pros and cons for each product.
// 4. "Best for" recommendations (e.g., "Best Value", "Premium Choice").
// 5. A buying guide explaining important factors to consider.
// 6. A conclusion with final recommendations.
// 7. An FAQ section with 3-5 common questions.

// IMPORTANT FORMATTING INSTRUCTIONS:
// - Format the content in proper markdown with clear structure
// - Use # for the main title
// - Use ## for major section headings
// - Use ### for product names and subsections
// - Use **bold text** for important points and product features
// - Use *italic text* for emphasis
// - Create proper tables with | separators and headers
// - Use bullet points (- ) for listing features and pros/cons
// - Use numbered lists (1. ) for steps or ranked items
// - Include proper paragraph breaks between sections
// - Make sure the content is well-structured and easy to read

// Include suggestions for affiliate links marked as: **[AFFILIATE LINK OPPORTUNITY]**.

// Note: I will add product images to the content later, so you don't need to include image placeholders.
// `
// }

// // Function to analyze SEO metrics
// function analyzeSeoMetrics(content, targetKeywords) {
//   const wordCount = content.split(/\s+/).length
//   const h1Count = (content.match(/# /g) || []).length
//   const h2Count = (content.match(/## /g) || []).length
//   const h3Count = (content.match(/### /g) || []).length

//   const keywordCounts = {}
//   if (targetKeywords) {
//     const keywords = targetKeywords.split(",").map((k) => k.trim().toLowerCase())
//     keywords.forEach((keyword) => {
//       const regex = new RegExp(`\\b${keyword}\\b`, "gi")
//       keywordCounts[keyword] = (content.match(regex) || []).length
//     })
//   }

//   const affiliateLinkCount = (content.match(/\[AFFILIATE LINK OPPORTUNITY\]/g) || []).length

//   return {
//     wordCount,
//     headingStructure: { h1: h1Count, h2: h2Count, h3: h3Count },
//     keywordDensity: keywordCounts,
//     affiliateLinkOpportunities: affiliateLinkCount,
//     readabilityScore: calculateReadabilityScore(content),
//   }
// }

// // Function to calculate readability score
// function calculateReadabilityScore(content) {
//   const sentences = content.split(/[.!?]+/).length
//   const words = content.split(/\s+/).length
//   const syllables = estimateSyllables(content)

//   if (sentences === 0 || words === 0) return 0

//   const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
//   return Math.min(Math.max(Math.round(score), 0), 100)
// }

// // Function to estimate syllables in text
// function estimateSyllables(text) {
//   const noSpecialChars = text.toLowerCase().replace(/[^a-z ]/g, "")
//   const words = noSpecialChars.split(" ")
//   let syllableCount = 0

//   words.forEach((word) => {
//     const vowelGroups = word.match(/[aeiouy]+/g)
//     syllableCount += vowelGroups ? vowelGroups.length : 1
//   })

//   return syllableCount
// }



// import { NextResponse } from "next/server"
// import { GoogleGenerativeAI } from "@google/generative-ai"

// const apiKey = process.env.GEMINI_API_KEY
// const genAI = new GoogleGenerativeAI(apiKey)

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) // Using a faster model

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 4096, // Reduced from 8192 to improve response time
//   responseMimeType: "text/plain",
// }

// // Add timeout handling
// const fetchWithTimeout = async (promise, timeout = 8000) => {
//   return Promise.race([
//     promise,
//     new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeout)),
//   ])
// }

// export async function POST(req) {
//   try {
//     const { products, keywords, promptTemplateId } = await req.json()

//     if (!products || products.length === 0) {
//       return NextResponse.json({ error: "Products data is required" }, { status: 400 })
//     }

//     console.log("Generating content for products:", products.length)

//     // Get the template if a promptTemplateId is provided
//     let templateContent = null
//     if (promptTemplateId) {
//       try {
//         // Import the getAmazonPromptTemplateById function
//         const { getAmazonPromptTemplateById } = await import("@/lib/models")
//         const template = await getAmazonPromptTemplateById(promptTemplateId)
//         if (template) {
//           templateContent = template.template
//         }
//       } catch (error) {
//         console.error("Error fetching template:", error)
//       }
//     }

//     // Create the structured prompt
//     const prompt = createPrompt(products, keywords, templateContent)

//     // Generate content with timeout
//     try {
//       const result = await fetchWithTimeout(
//         model.generateContent({
//           contents: [{ role: "user", parts: [{ text: prompt }] }],
//           generationConfig,
//         }),
//         8000, // 8 second timeout
//       )

//       const text = result?.response?.text() || "No response generated"

//       // Analyze SEO metrics
//       const seoMetrics = analyzeSeoMetrics(text, keywords)

//       return NextResponse.json({
//         content: text,
//         seoMetrics: seoMetrics,
//       })
//     } catch (timeoutError) {
//       console.error("AI generation timed out:", timeoutError)
//       return NextResponse.json(
//         {
//           error: "Content generation timed out. Please try again with a shorter request.",
//           fallbackContent: generateFallbackContent(products, keywords),
//         },
//         { status: 200 },
//       ) // Return 200 with fallback content
//     }
//   } catch (error) {
//     console.error("Content Generation Error:", error)
//     return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 })
//   }
// }

// // Create a fallback content generator for timeout cases
// function generateFallbackContent(products, keywords) {
//   const productList = products
//     .map((product, index) => `## ${product.title}\n\nPrice: ${product.price}\nRating: ${product.rating || "N/A"}\n\n`)
//     .join("\n")

//   return {
//     title: `Review of ${products.length} Products`,
//     content: `# Product Review\n\nThis is a review of the following products:\n\n${productList}\n\nKeywords: ${keywords || "product review"}`,
//     seoMetrics: {
//       wordCount: 100,
//       headingStructure: { h1: 1, h2: products.length, h3: 0 },
//       keywordDensity: {},
//       affiliateLinkOpportunities: products.length,
//       readabilityScore: 70,
//     },
//   }
// }

// // Update the createPrompt function to use templates and include image placeholders
// function createPrompt(products, keywords, template) {
//   // Simplify product details to reduce prompt size
//   const productDetails = products
//     .map((product, index) => {
//       return `
// Product ${index + 1}: ${product.title}
// Price: ${product.price}
// Rating: ${product.rating || "N/A"}
// `
//     })
//     .join("\n")

//   // If a template is provided, use it with replacements
//   if (template) {
//     return template
//       .replace("{{productDetails}}", productDetails)
//       .replace("{{keywords}}", keywords || "best products, product comparison, product review")
//   }

//   // Otherwise use a simplified default prompt
//   return `
// Create a concise product review comparing these Amazon products:

// ${productDetails}

// Target Keywords: ${keywords || "best products, product comparison, product review"}

// Format in markdown with:
// 1. A brief introduction
// 2. Product comparisons
// 3. Recommendations
// 4. Brief FAQ section
// `
// }

// // Function to analyze SEO metrics
// function analyzeSeoMetrics(content, targetKeywords) {
//   const wordCount = content.split(/\s+/).length
//   const h1Count = (content.match(/# /g) || []).length
//   const h2Count = (content.match(/## /g) || []).length
//   const h3Count = (content.match(/### /g) || []).length

//   const keywordCounts = {}
//   if (targetKeywords) {
//     const keywords = targetKeywords.split(",").map((k) => k.trim().toLowerCase())
//     keywords.forEach((keyword) => {
//       const regex = new RegExp(`\\b${keyword}\\b`, "gi")
//       keywordCounts[keyword] = (content.match(regex) || []).length
//     })
//   }

//   const affiliateLinkCount = (content.match(/\[AFFILIATE LINK OPPORTUNITY\]/g) || []).length

//   return {
//     wordCount,
//     headingStructure: { h1: h1Count, h2: h2Count, h3: h3Count },
//     keywordDensity: keywordCounts,
//     affiliateLinkOpportunities: affiliateLinkCount,
//     readabilityScore: calculateReadabilityScore(content),
//   }
// }

// // Function to calculate readability score
// function calculateReadabilityScore(content) {
//   const sentences = content.split(/[.!?]+/).length
//   const words = content.split(/\s+/).length
//   const syllables = estimateSyllables(content)

//   if (sentences === 0 || words === 0) return 0

//   const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
//   return Math.min(Math.max(Math.round(score), 0), 100)
// }

// // Function to estimate syllables in text
// function estimateSyllables(text) {
//   const noSpecialChars = text.toLowerCase().replace(/[^a-z ]/g, "")
//   const words = noSpecialChars.split(" ")
//   let syllableCount = 0

//   words.forEach((word) => {
//     const vowelGroups = word.match(/[aeiouy]+/g)
//     syllableCount += vowelGroups ? vowelGroups.length : 1
//   })

//   return syllableCount
// }




import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) // Using a faster model

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 4096, // Reduced from 8192 to improve response time
  responseMimeType: "text/plain",
}

// Update the timeout handling to be more robust
const fetchWithTimeout = async (promise, timeout = 25000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeout)),
  ])
}

export async function POST(req) {
  try {
    const { products, keywords, promptTemplateId } = await req.json()

    if (!products || products.length === 0) {
      return NextResponse.json({ error: "Products data is required" }, { status: 400 })
    }

    console.log("Generating content for products:", products.length)

    // Create the structured prompt
    const prompt = createPrompt(products, keywords, null) // Simplified - not using templates for now

    // Generate content with timeout
    try {
      // Use a more efficient approach with direct API call
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          ...generationConfig,
          maxOutputTokens: Math.min(generationConfig.maxOutputTokens, 2048), // Limit response size
        },
      })

      const text = result?.response?.text() || "No response generated"

      // Analyze SEO metrics
      const seoMetrics = analyzeSeoMetrics(text, keywords)

      return NextResponse.json({
        content: text,
        seoMetrics: seoMetrics,
      })
    } catch (timeoutError) {
      console.error("AI generation timed out:", timeoutError)
      return NextResponse.json(
        {
          error: "Content generation timed out. Please try again with a shorter request.",
          fallbackContent: generateFallbackContent(products, keywords),
        },
        { status: 200 },
      ) // Return 200 with fallback content
    }
  } catch (error) {
    console.error("Content Generation Error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to generate content",
        fallbackContent: generateFallbackContent(products, keywords || ""),
      },
      { status: 200 },
    )
  }
}

// Create a fallback content generator for timeout cases
function generateFallbackContent(products, keywords) {
  const productList = products
    .map((product, index) => `## ${product.title}\n\nPrice: ${product.price}\nRating: ${product.rating || "N/A"}\n\n`)
    .join("\n")

  return {
    title: `Review of ${products.length} Products`,
    content: `# Product Review\n\nThis is a review of the following products:\n\n${productList}\n\nKeywords: ${keywords || "product review"}`,
    seoMetrics: {
      wordCount: 100,
      headingStructure: { h1: 1, h2: products.length, h3: 0 },
      keywordDensity: {},
      affiliateLinkOpportunities: products.length,
      readabilityScore: 70,
    },
  }
}

// Update the createPrompt function to use templates and include image placeholders
function createPrompt(products, keywords, template) {
  // Simplify product details to reduce prompt size
  const productDetails = products
    .map((product, index) => {
      return `
Product ${index + 1}: ${product.title}
Price: ${product.price}
Rating: ${product.rating || "N/A"}
`
    })
    .join("\n")

  // If a template is provided, use it with replacements
  if (template) {
    return template
      .replace("{{productDetails}}", productDetails)
      .replace("{{keywords}}", keywords || "best products, product comparison, product review")
  }

  // Otherwise use a simplified default prompt
  return `
Create a concise product review comparing these Amazon products:

${productDetails}

Target Keywords: ${keywords || "best products, product comparison, product review"}

Format in markdown with:
1. A brief introduction
2. Product comparisons
3. Recommendations
4. Brief FAQ section
`
}

// Function to analyze SEO metrics
function analyzeSeoMetrics(content, targetKeywords) {
  const wordCount = content.split(/\s+/).length
  const h1Count = (content.match(/# /g) || []).length
  const h2Count = (content.match(/## /g) || []).length
  const h3Count = (content.match(/### /g) || []).length

  const keywordCounts = {}
  if (targetKeywords) {
    const keywords = targetKeywords.split(",").map((k) => k.trim().toLowerCase())
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      keywordCounts[keyword] = (content.match(regex) || []).length
    })
  }

  const affiliateLinkCount = (content.match(/\[AFFILIATE LINK OPPORTUNITY\]/g) || []).length

  return {
    wordCount,
    headingStructure: { h1: h1Count, h2: h2Count, h3: h3Count },
    keywordDensity: keywordCounts,
    affiliateLinkOpportunities: affiliateLinkCount,
    readabilityScore: calculateReadabilityScore(content),
  }
}

// Function to calculate readability score
function calculateReadabilityScore(content) {
  const sentences = content.split(/[.!?]+/).length
  const words = content.split(/\s+/).length
  const syllables = estimateSyllables(content)

  if (sentences === 0 || words === 0) return 0

  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  return Math.min(Math.max(Math.round(score), 0), 100)
}

// Function to estimate syllables in text
function estimateSyllables(text) {
  const noSpecialChars = text.toLowerCase().replace(/[^a-z ]/g, "")
  const words = noSpecialChars.split(" ")
  let syllableCount = 0

  words.forEach((word) => {
    const vowelGroups = word.match(/[aeiouy]+/g)
    syllableCount += vowelGroups ? vowelGroups.length : 1
  })

  return syllableCount
}

