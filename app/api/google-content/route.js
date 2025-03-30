import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { searchGoogle } from "@/lib/google-search"
import { analyzeSearchResults } from "@/lib/content-analysis"

// Initialize the Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

export async function POST(req) {
  try {
    const { keyword, contentType, contentLength, country, promptTemplateId } = await req.json()

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 })
    }

    try {
      // 1. Search Google (with reduced results to speed up)
      const searchResults = await searchGoogle(keyword, country, 5)

      // 2. Analyze search results
      const analysisData = await analyzeSearchResults(searchResults.textResults)

      // 3. Generate content with Gemini
      const content = await generateContentWithGemini({
        keyword,
        contentType,
        contentLength,
        ...analysisData,
        imageResults: searchResults.imageResults,
        promptTemplateId,
      })

      // 4. Perform SEO analysis
      const seoAnalysis = await performSEOAnalysis(content.content, keyword)

      // 5. Calculate readability score
      const readabilityScore = await calculateReadabilityScore(content.content)

      // 6. Generate affiliate link suggestions
      const affiliateLinks = await generateAffiliateLinks(keyword)

      // Return the complete result
      return NextResponse.json({
        title: content.title,
        content: content.content,
        seoAnalysis,
        readabilityScore,
        affiliateLinks,
        searchResults: searchResults.textResults, // Remove the slice to include all results
        imageResults: searchResults.imageResults.slice(0, 3),
      })
    } catch (error) {
      console.error("Error in content generation:", error)

      // Return fallback content
      const fallbackContent = generateFallbackContent(keyword, contentType)
      return NextResponse.json(
        {
          error: error.message || "Failed to generate content",
          fallbackContent,
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Error in Google Content API:", error)
    return NextResponse.json(
      {
        error: error.message || "An error occurred while generating content",
      },
      { status: 500 },
    )
  }
}

// Update the generateContentWithGemini function to properly include image placeholders
async function generateContentWithGemini(data) {
  const {
    keyword,
    keywords,
    titles,
    snippets,
    contentType = "blog",
    contentLength = "medium",
    imageResults = [],
    promptTemplateId,
  } = data

  // Configure content length based on user selection
  const lengthConfig = {
    short: { maxTokens: 2048, paragraphs: 3, wordCount: "500-800" },
    medium: { maxTokens: 4096, paragraphs: 5, wordCount: "1000-1500" },
    long: { maxTokens: 8192, paragraphs: 8, wordCount: "2000-3000" },
  }[contentLength] || { maxTokens: 4096, paragraphs: 5, wordCount: "1000-1500" }

  // Try to get the prompt template if provided
  let promptTemplate = null
  if (promptTemplateId) {
    try {
      // This would need to be implemented to fetch the template from your database
      // For now, we'll use a placeholder implementation
      promptTemplate = await getPromptTemplateById(promptTemplateId)
    } catch (error) {
      console.error("Error fetching prompt template:", error)
    }
  }

  // Prepare image placeholders - make them more explicit
  const imagePrompts =
    imageResults && imageResults.length > 0
      ? "Please include these image placeholders exactly as shown at appropriate places in the content:\n" +
        imageResults.map((image, index) => `[IMAGE${index + 1}] - ${image.title}`).join("\n")
      : ""

  let prompt
  if (promptTemplate) {
    // Use the template with replacements
    prompt = promptTemplate.template
      .replace(/{{keyword}}/g, keyword)
      .replace(/{{keywords}}/g, keywords ? keywords.join(", ") : keyword)
      .replace(/{{titles}}/g, titles ? titles.join("\n") : "")
      .replace(/{{snippets}}/g, snippets ? snippets.join("\n") : "")
      .replace(/{{contentType}}/g, contentType || "blog")
      .replace(/{{contentLength}}/g, contentLength || "medium")
      .replace(/{{imagePrompts}}/g, imagePrompts)
  } else {
    // Create a default prompt that encourages longer content
    prompt = `
Create a comprehensive, detailed ${contentType} about "${keyword}" with a word count of at least ${lengthConfig.wordCount} words.

Use these keywords: ${keywords ? keywords.join(", ") : keyword}

Based on these titles from top search results:
${titles ? titles.join("\n") : ""}

And these snippets:
${snippets ? snippets.join("\n") : ""}

${imagePrompts}

The content should be well-structured with:
- A compelling introduction that hooks the reader
- ${lengthConfig.paragraphs} or more detailed paragraphs with valuable information
- Clear headings and subheadings for better readability
- Practical examples and actionable advice
- A strong conclusion

Format the content in Markdown with proper headings, lists, and emphasis.
IMPORTANT: Make sure to include the image placeholders ([IMAGE1], [IMAGE2], etc.) at appropriate places in the content.
IMPORTANT: The final word count should be at least ${lengthConfig.wordCount} words.
`
  }

  try {
    // Use a model with appropriate token limits
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: lengthConfig.maxTokens,
      },
    })

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    })

    const generatedText = result.response.text()
    const titleMatch = generatedText.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : `${keyword} ${contentType}`

    return {
      title,
      content: generatedText,
    }
  } catch (error) {
    console.error("Error in generateContentWithGemini:", error)
    throw new Error(`Failed to generate content: ${error.message}`)
  }
}

// Helper function to get prompt template by ID
// This is a placeholder - you'll need to implement this to fetch from your database
async function getPromptTemplateById(id) {
  // Import the actual function from your models
  try {
    const { getPromptTemplateById } = await import("@/lib/models")
    return await getPromptTemplateById(id)
  } catch (error) {
    console.error("Error importing or calling getPromptTemplateById:", error)
    return null
  }
}

// Helper functions for SEO analysis and readability
async function performSEOAnalysis(content, keyword) {
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

function calculateReadabilityScore(content) {
  const sentences = content.split(/[.!?]+\s/).length
  const words = content.split(/\s+/).length
  const syllables = content.split(/\s+/).reduce((count, word) => {
    return count + (word.match(/[aeiou]/gi) || []).length
  }, 0)

  const fleschKincaid = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  return Math.max(0, Math.min(100, fleschKincaid)).toFixed(1)
}

function generateAffiliateLinks(keyword) {
  // This is a placeholder function. In a real-world scenario, you'd integrate with
  // an affiliate network API or use a database of affiliate products.
  const placeholderLinks = [
    { name: "Amazon", url: `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=youraffiliateid` },
    { name: "eBay", url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}&campid=youraffiliateid` },
    {
      name: "Walmart",
      url: `https://www.walmart.com/search/?query=${encodeURIComponent(keyword)}&affid=youraffiliateid`,
    },
  ]

  return placeholderLinks
}

// Function to generate fallback content
function generateFallbackContent(keyword, contentType) {
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

