import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

// Create a streaming model for faster responses
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
})

export async function POST(req) {
  try {
    const { products, keywords, promptTemplateId, contentLength = "medium" } = await req.json()

    if (!products || products.length === 0) {
      return NextResponse.json({ error: "Products data is required" }, { status: 400 })
    }

    // Configure based on content length
    const lengthConfig = {
      short: { maxTokens: 2048, wordCount: "800-1000" },
      medium: { maxTokens: 4096, wordCount: "1500-2000" },
      long: { maxTokens: 8192, wordCount: "2500-3000" },
    }[contentLength] || { maxTokens: 4096, wordCount: "1500-2000" }

    // Create the structured prompt
    const prompt = createPrompt(products, keywords, contentLength, lengthConfig.wordCount)

    try {
      // Generate content with a longer timeout
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: lengthConfig.maxTokens,
        },
      })

      const text = result?.response?.text() || "No response generated"

      // Analyze SEO metrics
      const seoMetrics = analyzeSeoMetrics(text, keywords)

      return NextResponse.json({
        content: text,
        seoMetrics: seoMetrics,
      })
    } catch (error) {
      console.error("AI generation error:", error)
      return NextResponse.json(
        {
          error: "Content generation failed. Please try again with a shorter request.",
          fallbackContent: generateFallbackContent(products, keywords),
        },
        { status: 200 },
      )
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

// Create a more effective prompt
function createPrompt(products, keywords, contentLength, wordCount) {
  // Format product details
  const productDetails = products
    .map((product, index) => {
      return `
Product ${index + 1}: ${product.title}
Price: ${product.price}
Rating: ${product.rating || "N/A"}
`
    })
    .join("\n")

  // Create a comprehensive prompt
  return `
Create a comprehensive, detailed product review comparing these Amazon products with a word count of ${wordCount} words:

${productDetails}

Target Keywords: ${keywords || "best products, product comparison, product review"}

IMPORTANT INSTRUCTIONS:
1. Format in markdown with proper headings, lists, and emphasis
2. Include a compelling title as an H1 heading
3. Write an engaging introduction about the product category
4. Include a comparison table of all products with their key features, prices, and ratings
5. Provide detailed reviews with pros and cons for each product
6. Add "Best for" recommendations (e.g., "Best Value", "Premium Choice")
7. Include a buying guide explaining important factors to consider
8. End with a conclusion and final recommendations
9. Add an FAQ section with 3-5 common questions and answers

CRITICAL: Insert image placeholders for each product exactly in this format: [PRODUCT_IMAGE1], [PRODUCT_IMAGE2], etc.
Place these image placeholders at appropriate locations in the content, typically after introducing each product.

IMPORTANT: The final word count must be at least ${wordCount} words. This is a comprehensive review that needs to be detailed and thorough.
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

// Create a fallback content generator for timeout cases
function generateFallbackContent(products, keywords) {
  const productList = products
    .map(
      (product, index) => `## ${product.title}

Price: ${product.price}
Rating: ${product.rating || "N/A"}

[PRODUCT_IMAGE${index + 1}]

This product offers good value and features that many users appreciate.
`,
    )
    .join("\n")

  return {
    title: `Review of ${products.length} Products`,
    content: `# Product Review

This is a review of the following products:

${productList}

## Comparison

These products have different features and price points that appeal to different users.

## Recommendation

Consider your specific needs when choosing between these options.

Keywords: ${keywords || "product review"}`,
    seoMetrics: {
      wordCount: 150,
      headingStructure: { h1: 1, h2: products.length + 2, h3: 0 },
      keywordDensity: {},
      affiliateLinkOpportunities: products.length,
      readabilityScore: 70,
    },
  }
}

