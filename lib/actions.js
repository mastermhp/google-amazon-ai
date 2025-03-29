// // amazon prompts 

// "use server"
// import {
//   saveContent,
//   getPromptTemplateById,
//   getDefaultPromptTemplate,
//   getPromptTemplates,
//   deletePromptTemplate,
//   getContentHistory,
//   getContentById,
//   deleteContent,
//   savePromptTemplate,
//   updateContent as updateContentInDb,
//   authenticateUser,
//   saveAmazonReview,
//   getAmazonReviewHistory,
//   getAmazonReviewById,
//   deleteAmazonReview,
//   saveAmazonPromptTemplate,
//   getAmazonPromptTemplates,
//   deleteAmazonPromptTemplate,
//   getDefaultAmazonPromptTemplate,
//   getAllContent,
// } from "./models"
// import https from "https"

// // Create a custom HTTPS agent with relaxed SSL options
// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false, // This is less secure but can help bypass SSL issues
// })

// export async function generateContent(params) {
//   const { keyword, searchResults } = params

//   // Analyze search results
//   const analysisData = await analyzeSearchResults(searchResults)

//   // Generate content with Gemini
//   const generatedContent = await generateContentWithGemini({
//     keyword,
//     ...analysisData,
//   })

//   return generatedContent
// }

// async function analyzeSearchResults(searchResults) {
//   const titles = searchResults.map((item) => item.title)
//   const snippets = searchResults.map((item) => item.snippet)
//   const links = searchResults.map((item) => item.link)

//   const allText = [...titles, ...snippets].join(" ")
//   const words = allText.toLowerCase().match(/\b\w{4,}\b/g) || []
//   const wordFrequency = {}

//   words.forEach((word) => {
//     wordFrequency[word] = (wordFrequency[word] || 0) + 1
//   })

//   const sortedKeywords = Object.entries(wordFrequency)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 10)
//     .map(([word]) => word)

//   return {
//     titles,
//     snippets,
//     links,
//     keywords: sortedKeywords,
//     allText,
//   }
// }

// async function generateContentWithGemini(data) {
//   const {
//     keyword,
//     keywords,
//     titles,
//     snippets,
//     contentType = "blog",
//     contentLength = "medium",
//     imageResults = [],
//     promptTemplateId,
//   } = data

//   let promptTemplate

//   if (promptTemplateId) {
//     try {
//       promptTemplate = await getPromptTemplateById(promptTemplateId)
//     } catch (error) {
//       console.error("Error fetching prompt template:", error)
//     }
//   }

//   if (!promptTemplate) {
//     promptTemplate = await getDefaultPromptTemplate()
//   }

//   const imagePrompts = imageResults
//     ? imageResults
//         .slice(0, 3)
//         .map((image, index) => `[IMAGE${index + 1}]: ${image.title}`)
//         .join("\n")
//     : ""

//   // Replace template variables
//   const prompt = promptTemplate.template
//     .replace("{{keyword}}", keyword)
//     .replace("{{keywords}}", keywords ? keywords.join(", ") : keyword)
//     .replace("{{titles}}", titles ? titles.slice(0, 5).join("\n") : "")
//     .replace("{{snippets}}", snippets ? snippets.slice(0, 5).join("\n") : "")
//     .replace("{{imagePrompts}}", imagePrompts)
//     .replace("{{contentType}}", contentType || "blog")
//     .replace("{{contentLength}}", contentLength || "medium")

//   try {
//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": process.env.GEMINI_API_KEY,
//         },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//           generationConfig: {
//             temperature: 0.7,
//             topK: 40,
//             topP: 0.95,
//             maxOutputTokens: 8192,
//           },
//         }),
//         // Add custom agent to handle SSL issues
//         agent: httpsAgent,
//       },
//     )

//     if (!response.ok) {
//       const errorData = await response.json()
//       console.error("Gemini API error:", errorData)
//       throw new Error(`Gemini API responded with status ${response.status}: ${JSON.stringify(errorData)}`)
//     }

//     const result = await response.json()

//     if (!result.candidates || result.candidates.length === 0) {
//       console.error("No candidates in Gemini API response")
//       throw new Error("Failed to generate content: No candidates returned")
//     }

//     const generatedText = result.candidates[0].content.parts[0].text

//     const titleMatch = generatedText.match(/^#\s+(.+)$/m)
//     const title = titleMatch ? titleMatch[1] : `${keyword} Guide`

//     return {
//       title,
//       content: generatedText,
//     }
//   } catch (error) {
//     console.error("Error in generateContentWithGemini:", error)
//     throw new Error(`Failed to generate content: ${error.message}`)
//   }
// }

// export async function searchAndGenerate(params) {
//   const { keyword, contentType = "blog", contentLength = "medium", country = "us", promptTemplateId } = params

//   try {
//     // 1. Search Google
//     const { textResults, imageResults } = await searchGoogle(keyword, country)

//     if (textResults.length === 0 && imageResults.length === 0) {
//       throw new Error("No search results found for this keyword")
//     }

//     // 2. Analyze search results
//     const analysisData = await analyzeSearchResults(textResults)

//     // 3. Generate content with Gemini
//     const generatedContent = await generateContentWithGemini({
//       keyword,
//       contentType,
//       contentLength,
//       promptTemplateId,
//       ...analysisData,
//       imageResults,
//     })

//     // 4. Perform SEO analysis
//     const seoAnalysis = await performSEOAnalysis(generatedContent.content, keyword)

//     // 5. Calculate readability score
//     const readabilityScore = calculateReadabilityScore(generatedContent.content)

//     // 6. Generate affiliate link suggestions
//     const affiliateLinks = await generateAffiliateLinks(keyword)

//     // 7. Store in MongoDB
//     const contentData = {
//       keyword,
//       contentType,
//       contentLength,
//       country,
//       title: generatedContent.title,
//       content: generatedContent.content,
//       seoAnalysis,
//       readabilityScore,
//       affiliateLinks,
//       searchResults: textResults.slice(0, 10),
//       imageResults: imageResults.slice(0, 3),
//     }

//     const savedContent = await saveContent(contentData)
//     console.log("Content saved to MongoDB:", savedContent)

//     return {
//       ...contentData,
//       _id: savedContent._id,
//     }
//   } catch (error) {
//     console.error("Error in searchAndGenerate:", error)
//     throw new Error(`Failed to generate content: ${error.message}`)
//   }
// }

// async function searchGoogle(keyword, country = "us") {
//   // First, search for text results
//   const textUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10&gl=${country}`

//   // Then, search for image results
//   const imageUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10&searchType=image&gl=${country}`

//   try {
//     const [textResponse, imageResponse] = await Promise.all([
//       fetch(textUrl, {
//         cache: "no-store",
//         agent: httpsAgent, // Add custom agent to handle SSL issues
//       }),
//       fetch(imageUrl, {
//         cache: "no-store",
//         agent: httpsAgent, // Add custom agent to handle SSL issues
//       }),
//     ])

//     if (!textResponse.ok) {
//       const errorData = await textResponse.json()
//       console.error("Google API error (text search):", errorData)
//       throw new Error(`Google API responded with status ${textResponse.status}`)
//     }

//     if (!imageResponse.ok) {
//       const errorData = await imageResponse.json()
//       console.error("Google API error (image search):", errorData)
//       throw new Error(`Google API responded with status ${imageResponse.status}`)
//     }

//     const textData = await textResponse.json()
//     const imageData = await imageResponse.json()

//     const textResults = textData.items
//       ? textData.items.map((item) => ({
//           title: item.title,
//           snippet: item.snippet || "",
//           link: item.link,
//           displayLink: item.displayLink || "",
//           formattedUrl: item.formattedUrl || item.link,
//         }))
//       : []

//     const imageResults = imageData.items
//       ? imageData.items.map((item) => ({
//           title: item.title,
//           link: item.link,
//           thumbnail: item.image.thumbnailLink,
//           context: item.image.contextLink,
//         }))
//       : []

//     return { textResults, imageResults }
//   } catch (error) {
//     console.error("Error in searchGoogle:", error)
//     throw new Error(`Failed to search Google: ${error.message}`)
//   }
// }

// async function performSEOAnalysis(content, keyword) {
//   const wordCount = content.split(/\s+/).length
//   const keywordDensity = ((content.toLowerCase().split(keyword.toLowerCase()).length - 1) / wordCount) * 100
//   const headingsCount = (content.match(/^#+\s/gm) || []).length
//   const paragraphCount = (content.match(/\n\n/g) || []).length + 1
//   const averageSentenceLength =
//     content.split(/[.!?]+\s/).reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0) /
//     (content.match(/[.!?]+/g) || []).length

//   return {
//     wordCount,
//     keywordDensity: keywordDensity.toFixed(2),
//     headingsCount,
//     paragraphCount,
//     averageSentenceLength: averageSentenceLength.toFixed(1),
//   }
// }

// function calculateReadabilityScore(content) {
//   const sentences = content.split(/[.!?]+\s/).length
//   const words = content.split(/\s+/).length
//   const syllables = content.split(/\s+/).reduce((count, word) => {
//     return count + (word.match(/[aeiou]/gi) || []).length
//   }, 0)

//   const fleschKincaid = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
//   return Math.max(0, Math.min(100, fleschKincaid)).toFixed(1)
// }

// async function generateAffiliateLinks(keyword) {
//   // This is a placeholder function. In a real-world scenario, you'd integrate with
//   // an affiliate network API or use a database of affiliate products.
//   const placeholderLinks = [
//     { name: "Amazon", url: `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=youraffiliateid` },
//     { name: "eBay", url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}&campid=youraffiliateid` },
//     {
//       name: "Walmart",
//       url: `https://www.walmart.com/search/?query=${encodeURIComponent(keyword)}&affid=youraffiliateid`,
//     },
//   ]

//   return placeholderLinks
// }

// export async function createContent(params) {
//   const { keyword } = params
//   return searchAndGenerate(params)
// }

// export async function updateContent(params) {
//   const { id, content } = params

//   try {
//     // Update content in MongoDB
//     const updated = await updateContentInDb(id, { content })

//     if (!updated) {
//       throw new Error("Content not found")
//     }

//     return {
//       id,
//       content: updated.content,
//       updatedAt: updated.updatedAt,
//     }
//   } catch (error) {
//     console.error("Error updating content:", error)
//     throw new Error(`Failed to update content: ${error.message}`)
//   }
// }

// // Admin actions for prompt templates
// export async function savePromptTemplateAction(template) {
//   try {
//     const result = await savePromptTemplate(template)
//     return result
//   } catch (error) {
//     console.error("Error saving prompt template:", error)
//     throw new Error(`Failed to save prompt template: ${error.message}`)
//   }
// }

// export async function getPromptTemplatesAction() {
//   try {
//     return await getPromptTemplates()
//   } catch (error) {
//     console.error("Error fetching prompt templates:", error)
//     throw new Error(`Failed to fetch prompt templates: ${error.message}`)
//   }
// }

// export async function deletePromptTemplateAction(id) {
//   try {
//     const result = await deletePromptTemplate(id)
//     return result
//   } catch (error) {
//     console.error("Error deleting prompt template:", error)
//     throw new Error(`Failed to delete prompt template: ${error.message}`)
//   }
// }

// // Content history actions
// export async function getContentHistoryAction(page = 1, limit = 10) {
//   try {
//     const skip = (page - 1) * limit
//     const result = await getContentHistory(limit, skip)
//     console.log("Content history retrieved from MongoDB:", result)
//     return result
//   } catch (error) {
//     console.error("Error fetching content history:", error)
//     throw new Error(`Failed to fetch content history: ${error.message}`)
//   }
// }

// export async function getContentByIdAction(id) {
//   try {
//     return await getContentById(id)
//   } catch (error) {
//     console.error("Error fetching content:", error)
//     throw new Error(`Failed to fetch content: ${error.message}`)
//   }
// }

// export async function deleteContentAction(id) {
//   try {
//     const result = await deleteContent(id)
//     return result
//   } catch (error) {
//     console.error("Error deleting content:", error)
//     throw new Error(`Failed to delete content: ${error.message}`)
//   }
// }

// // Authentication
// export async function authenticate(username, password) {
//   try {
//     return await authenticateUser(username, password)
//   } catch (error) {
//     console.error("Authentication error:", error)
//     return { success: false, error: "Authentication failed" }
//   }
// }

// // Amazon Review Actions
// export async function saveAmazonReviewAction(review) {
//   try {
//     const savedReview = await saveAmazonReview(review)
//     return savedReview
//   } catch (error) {
//     console.error("Error saving Amazon review:", error)
//     throw new Error(`Failed to save Amazon review: ${error.message}`)
//   }
// }

// export async function getAmazonReviewHistoryAction(page = 1, limit = 10) {
//   try {
//     const skip = (page - 1) * limit
//     const result = await getAmazonReviewHistory(limit, skip)
//     console.log("Amazon review history retrieved from MongoDB:", result)
//     return result
//   } catch (error) {
//     console.error("Error fetching Amazon review history:", error)
//     throw new Error(`Failed to fetch Amazon review history: ${error.message}`)
//   }
// }

// export async function getAmazonReviewByIdAction(id) {
//   try {
//     return await getAmazonReviewById(id)
//   } catch (error) {
//     console.error("Error fetching Amazon review:", error)
//     throw new Error(`Failed to fetch Amazon review: ${error.message}`)
//   }
// }

// export async function deleteAmazonReviewAction(id) {
//   try {
//     const result = await deleteAmazonReview(id)
//     return result
//   } catch (error) {
//     console.error("Error deleting Amazon review:", error)
//     throw new Error(`Failed to delete Amazon review: ${error.message}`)
//   }
// }

// // Add these Amazon prompt template actions
// export async function saveAmazonPromptTemplateAction(template) {
//   try {
//     const result = await saveAmazonPromptTemplate(template)
//     return result
//   } catch (error) {
//     console.error("Error saving Amazon prompt template:", error)
//     throw new Error(`Failed to save Amazon prompt template: ${error.message}`)
//   }
// }

// export async function getAmazonPromptTemplatesAction() {
//   try {
//     return await getAmazonPromptTemplates()
//   } catch (error) {
//     console.error("Error fetching Amazon prompt templates:", error)
//     throw new Error(`Failed to fetch Amazon prompt templates: ${error.message}`)
//   }
// }

// export async function deleteAmazonPromptTemplateAction(id) {
//   try {
//     const result = await deleteAmazonPromptTemplate(id)
//     return result
//   } catch (error) {
//     console.error("Error deleting Amazon prompt template:", error)
//     throw new Error(`Failed to delete Amazon prompt template: ${error.message}`)
//   }
// }

// export async function getDefaultAmazonPromptTemplateAction() {
//   try {
//     return await getDefaultAmazonPromptTemplate()
//   } catch (error) {
//     console.error("Error fetching default Amazon prompt template:", error)
//     throw new Error(`Failed to fetch default Amazon prompt template: ${error.message}`)
//   }
// }

// // Add a unified content history action
// export async function getAllContentHistoryAction(page = 1, limit = 10) {
//   try {
//     const skip = (page - 1) * limit
//     const result = await getAllContent(limit, skip)
//     console.log("All content history retrieved from MongoDB:", result)
//     return result
//   } catch (error) {
//     console.error("Error fetching all content history:", error)
//     throw new Error(`Failed to fetch all content history: ${error.message}`)
//   }
// }



// "use server"
// import {
//   saveContent,
//   getPromptTemplateById,
//   getDefaultPromptTemplate,
//   getPromptTemplates,
//   deletePromptTemplate,
//   getContentHistory,
//   getContentById,
//   deleteContent,
//   savePromptTemplate,
//   updateContent as updateContentInDb,
//   authenticateUser,
//   saveAmazonReview,
//   getAmazonReviewHistory,
//   getAmazonReviewById,
//   deleteAmazonReview,
//   saveAmazonPromptTemplate,
//   getAmazonPromptTemplates,
//   deleteAmazonPromptTemplate,
//   getDefaultAmazonPromptTemplate,
//   getAllContent,
// } from "./models"
// import https from "https"

// // Create a custom HTTPS agent with relaxed SSL options
// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false, // This is less secure but can help bypass SSL issues
// })

// export async function generateContent(params) {
//   const { keyword, searchResults } = params

//   // Analyze search results
//   const analysisData = await analyzeSearchResults(searchResults)

//   // Generate content with Gemini
//   const generatedContent = await generateContentWithGemini({
//     keyword,
//     ...analysisData,
//   })

//   return generatedContent
// }

// async function analyzeSearchResults(searchResults) {
//   const titles = searchResults.map((item) => item.title)
//   const snippets = searchResults.map((item) => item.snippet)
//   const links = searchResults.map((item) => item.link)

//   const allText = [...titles, ...snippets].join(" ")
//   const words = allText.toLowerCase().match(/\b\w{4,}\b/g) || []
//   const wordFrequency = {}

//   words.forEach((word) => {
//     wordFrequency[word] = (wordFrequency[word] || 0) + 1
//   })

//   const sortedKeywords = Object.entries(wordFrequency)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 10)
//     .map(([word]) => word)

//   return {
//     titles,
//     snippets,
//     links,
//     keywords: sortedKeywords,
//     allText,
//   }
// }

// async function generateContentWithGemini(data) {
//   const {
//     keyword,
//     keywords,
//     titles,
//     snippets,
//     contentType = "blog",
//     contentLength = "medium",
//     imageResults = [],
//     promptTemplateId,
//   } = data

//   let promptTemplate

//   if (promptTemplateId) {
//     try {
//       promptTemplate = await getPromptTemplateById(promptTemplateId)
//     } catch (error) {
//       console.error("Error fetching prompt template:", error)
//     }
//   }

//   if (!promptTemplate) {
//     promptTemplate = await getDefaultPromptTemplate()
//   }

//   const imagePrompts = imageResults
//     ? imageResults
//         .slice(0, 3)
//         .map((image, index) => `[IMAGE${index + 1}]: ${image.title}`)
//         .join("\n")
//     : ""

//   // Replace template variables
//   const prompt = promptTemplate.template
//     .replace("{{keyword}}", keyword)
//     .replace("{{keywords}}", keywords ? keywords.join(", ") : keyword)
//     .replace("{{titles}}", titles ? titles.slice(0, 5).join("\n") : "")
//     .replace("{{snippets}}", snippets ? snippets.slice(0, 5).join("\n") : "")
//     .replace("{{imagePrompts}}", imagePrompts)
//     .replace("{{contentType}}", contentType || "blog")
//     .replace("{{contentLength}}", contentLength || "medium")

//   try {
//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": process.env.GEMINI_API_KEY,
//         },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//           generationConfig: {
//             temperature: 0.7,
//             topK: 40,
//             topP: 0.95,
//             maxOutputTokens: 8192,
//           },
//         }),
//         // Add custom agent to handle SSL issues
//         agent: httpsAgent,
//       },
//     )

//     if (!response.ok) {
//       const errorData = await response.json()
//       console.error("Gemini API error:", errorData)
//       throw new Error(`Gemini API responded with status ${response.status}: ${JSON.stringify(errorData)}`)
//     }

//     const result = await response.json()

//     if (!result.candidates || result.candidates.length === 0) {
//       console.error("No candidates in Gemini API response")
//       throw new Error("Failed to generate content: No candidates returned")
//     }

//     const generatedText = result.candidates[0].content.parts[0].text

//     const titleMatch = generatedText.match(/^#\s+(.+)$/m)
//     const title = titleMatch ? titleMatch[1] : `${keyword} Guide`

//     return {
//       title,
//       content: generatedText,
//     }
//   } catch (error) {
//     console.error("Error in generateContentWithGemini:", error)
//     throw new Error(`Failed to generate content: ${error.message}`)
//   }
// }

// export async function searchAndGenerate(params) {
//   const { keyword, contentType = "blog", contentLength = "medium", country = "us", promptTemplateId } = params

//   try {
//     // 1. Search Google
//     const { textResults, imageResults } = await searchGoogle(keyword, country)

//     if (textResults.length === 0 && imageResults.length === 0) {
//       throw new Error("No search results found for this keyword")
//     }

//     // 2. Analyze search results
//     const analysisData = await analyzeSearchResults(textResults)

//     // 3. Generate content with Gemini
//     const generatedContent = await generateContentWithGemini({
//       keyword,
//       contentType,
//       contentLength,
//       promptTemplateId,
//       ...analysisData,
//       imageResults,
//     })

//     // 4. Perform SEO analysis
//     const seoAnalysis = await performSEOAnalysis(generatedContent.content, keyword)

//     // 5. Calculate readability score
//     const readabilityScore = calculateReadabilityScore(generatedContent.content)

//     // 6. Generate affiliate link suggestions
//     const affiliateLinks = await generateAffiliateLinks(keyword)

//     // 7. Store in MongoDB
//     const contentData = {
//       keyword,
//       contentType,
//       contentLength,
//       country,
//       title: generatedContent.title,
//       content: generatedContent.content,
//       seoAnalysis,
//       readabilityScore,
//       affiliateLinks,
//       searchResults: textResults.slice(0, 10),
//       imageResults: imageResults.slice(0, 3),
//     }

//     const savedContent = await saveContent(contentData)
//     console.log("Content saved to MongoDB:", savedContent)

//     return {
//       ...contentData,
//       _id: savedContent._id,
//     }
//   } catch (error) {
//     console.error("Error in searchAndGenerate:", error)
//     throw new Error(`Failed to generate content: ${error.message}`)
//   }
// }

// async function searchGoogle(keyword, country = "us") {
//   // First, search for text results
//   const textUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10&gl=${country}`

//   // Then, search for image results
//   const imageUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10&searchType=image&gl=${country}`

//   try {
//     const [textResponse, imageResponse] = await Promise.all([
//       fetch(textUrl, {
//         cache: "no-store",
//         agent: httpsAgent, // Add custom agent to handle SSL issues
//       }),
//       fetch(imageUrl, {
//         cache: "no-store",
//         agent: httpsAgent, // Add custom agent to handle SSL issues
//       }),
//     ])

//     if (!textResponse.ok) {
//       const errorData = await textResponse.json()
//       console.error("Google API error (text search):", errorData)
//       throw new Error(`Google API responded with status ${textResponse.status}`)
//     }

//     if (!imageResponse.ok) {
//       const errorData = await imageResponse.json()
//       console.error("Google API error (image search):", errorData)
//       throw new Error(`Google API responded with status ${imageResponse.status}`)
//     }

//     const textData = await textResponse.json()
//     const imageData = await imageResponse.json()

//     const textResults = textData.items
//       ? textData.items.map((item) => ({
//           title: item.title,
//           snippet: item.snippet || "",
//           link: item.link,
//           displayLink: item.displayLink || "",
//           formattedUrl: item.formattedUrl || item.link,
//         }))
//       : []

//     const imageResults = imageData.items
//       ? imageData.items.map((item) => ({
//           title: item.title,
//           link: item.link,
//           thumbnail: item.image.thumbnailLink,
//           context: item.image.contextLink,
//         }))
//       : []

//     return { textResults, imageResults }
//   } catch (error) {
//     console.error("Error in searchGoogle:", error)
//     throw new Error(`Failed to search Google: ${error.message}`)
//   }
// }

// async function performSEOAnalysis(content, keyword) {
//   const wordCount = content.split(/\s+/).length
//   const keywordDensity = ((content.toLowerCase().split(keyword.toLowerCase()).length - 1) / wordCount) * 100
//   const headingsCount = (content.match(/^#+\s/gm) || []).length
//   const paragraphCount = (content.match(/\n\n/g) || []).length + 1
//   const averageSentenceLength =
//     content.split(/[.!?]+\s/).reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0) /
//     (content.match(/[.!?]+/g) || []).length

//   return {
//     wordCount,
//     keywordDensity: keywordDensity.toFixed(2),
//     headingsCount,
//     paragraphCount,
//     averageSentenceLength: averageSentenceLength.toFixed(1),
//   }
// }

// function calculateReadabilityScore(content) {
//   const sentences = content.split(/[.!?]+\s/).length
//   const words = content.split(/\s+/).length
//   const syllables = content.split(/\s+/).reduce((count, word) => {
//     return count + (word.match(/[aeiou]/gi) || []).length
//   }, 0)

//   const fleschKincaid = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
//   return Math.max(0, Math.min(100, fleschKincaid)).toFixed(1)
// }

// async function generateAffiliateLinks(keyword) {
//   // This is a placeholder function. In a real-world scenario, you'd integrate with
//   // an affiliate network API or use a database of affiliate products.
//   const placeholderLinks = [
//     { name: "Amazon", url: `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=youraffiliateid` },
//     { name: "eBay", url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}&campid=youraffiliateid` },
//     {
//       name: "Walmart",
//       url: `https://www.walmart.com/search/?query=${encodeURIComponent(keyword)}&affid=youraffiliateid`,
//     },
//   ]

//   return placeholderLinks
// }

// export async function createContent(params) {
//   const { keyword } = params
//   return searchAndGenerate(params)
// }

// export async function updateContent(params) {
//   const { id, content } = params

//   try {
//     // Update content in MongoDB
//     const updated = await updateContentInDb(id, { content })

//     if (!updated) {
//       throw new Error("Content not found")
//     }

//     return {
//       id,
//       content: updated.content,
//       updatedAt: updated.updatedAt,
//     }
//   } catch (error) {
//     console.error("Error updating content:", error)
//     throw new Error(`Failed to update content: ${error.message}`)
//   }
// }

// // Admin actions for prompt templates
// export async function savePromptTemplateAction(template) {
//   try {
//     const result = await savePromptTemplate(template)
//     return result
//   } catch (error) {
//     console.error("Error saving prompt template:", error)
//     throw new Error(`Failed to save prompt template: ${error.message}`)
//   }
// }

// // Update the getPromptTemplatesAction function to use a simpler approach
// export async function getPromptTemplatesAction() {
//   try {
//     const templates = await getPromptTemplates()
//     // Convert MongoDB objects to plain objects using JSON serialization
//     return JSON.parse(JSON.stringify(templates))
//   } catch (error) {
//     console.error("Error fetching prompt templates:", error)
//     throw new Error(`Failed to fetch prompt templates: ${error.message}`)
//   }
// }

// export async function deletePromptTemplateAction(id) {
//   try {
//     const result = await deletePromptTemplate(id)
//     return result
//   } catch (error) {
//     console.error("Error deleting prompt template:", error)
//     throw new Error(`Failed to delete prompt template: ${error.message}`)
//   }
// }

// // Content history actions
// // Update other functions to use the same approach
// export async function getContentHistoryAction(page = 1, limit = 10) {
//   try {
//     const skip = (page - 1) * limit
//     const result = await getContentHistory(limit, skip)
//     console.log("Content history retrieved from MongoDB:", result)
//     return JSON.parse(JSON.stringify(result))
//   } catch (error) {
//     console.error("Error fetching content history:", error)
//     throw new Error(`Failed to fetch content history: ${error.message}`)
//   }
// }

// export async function getContentByIdAction(id) {
//   try {
//     const content = await getContentById(id)
//     return JSON.parse(JSON.stringify(content))
//   } catch (error) {
//     console.error("Error fetching content:", error)
//     throw new Error(`Failed to fetch content: ${error.message}`)
//   }
// }

// export async function deleteContentAction(id) {
//   try {
//     const result = await deleteContent(id)
//     return result
//   } catch (error) {
//     console.error("Error deleting content:", error)
//     throw new Error(`Failed to delete content: ${error.message}`)
//   }
// }

// // Authentication
// export async function authenticate(username, password) {
//   try {
//     return await authenticateUser(username, password)
//   } catch (error) {
//     console.error("Authentication error:", error)
//     return { success: false, error: "Authentication failed" }
//   }
// }

// // Amazon Review Actions
// export async function saveAmazonReviewAction(review) {
//   try {
//     const savedReview = await saveAmazonReview(review)
//     return savedReview
//   } catch (error) {
//     console.error("Error saving Amazon review:", error)
//     throw new Error(`Failed to save Amazon review: ${error.message}`)
//   }
// }

// export async function getAmazonReviewHistoryAction(page = 1, limit = 10) {
//   try {
//     const skip = (page - 1) * limit
//     const result = await getAmazonReviewHistory(limit, skip)
//     console.log("Amazon review history retrieved from MongoDB:", result)
//     return JSON.parse(JSON.stringify(result))
//   } catch (error) {
//     console.error("Error fetching Amazon review history:", error)
//     throw new Error(`Failed to fetch Amazon review history: ${error.message}`)
//   }
// }

// export async function getAmazonReviewByIdAction(id) {
//   try {
//     const review = await getAmazonReviewById(id)
//     return JSON.parse(JSON.stringify(review))
//   } catch (error) {
//     console.error("Error fetching Amazon review:", error)
//     throw new Error(`Failed to fetch Amazon review: ${error.message}`)
//   }
// }

// export async function deleteAmazonReviewAction(id) {
//   try {
//     const result = await deleteAmazonReview(id)
//     return result
//   } catch (error) {
//     console.error("Error deleting Amazon review:", error)
//     throw new Error(`Failed to delete Amazon review: ${error.message}`)
//   }
// }

// // Add these Amazon prompt template actions
// export async function saveAmazonPromptTemplateAction(template) {
//   try {
//     const result = await saveAmazonPromptTemplate(template)
//     return result
//   } catch (error) {
//     console.error("Error saving Amazon prompt template:", error)
//     throw new Error(`Failed to save Amazon prompt template: ${error.message}`)
//   }
// }

// export async function getAmazonPromptTemplatesAction() {
//   try {
//     const templates = await getAmazonPromptTemplates()
//     return JSON.parse(JSON.stringify(templates))
//   } catch (error) {
//     console.error("Error fetching Amazon prompt templates:", error)
//     throw new Error(`Failed to fetch Amazon prompt templates: ${error.message}`)
//   }
// }

// export async function deleteAmazonPromptTemplateAction(id) {
//   try {
//     const result = await deleteAmazonPromptTemplate(id)
//     return result
//   } catch (error) {
//     console.error("Error deleting Amazon prompt template:", error)
//     throw new Error(`Failed to delete Amazon prompt template: ${error.message}`)
//   }
// }

// export async function getDefaultAmazonPromptTemplateAction() {
//   try {
//     return await getDefaultAmazonPromptTemplate()
//   } catch (error) {
//     console.error("Error fetching default Amazon prompt template:", error)
//     throw new Error(`Failed to fetch default Amazon prompt template: ${error.message}`)
//   }
// }

// // Add a unified content history action
// export async function getAllContentHistoryAction(page = 1, limit = 10) {
//   try {
//     const skip = (page - 1) * limit
//     const result = await getAllContent(limit, skip)
//     console.log("All content history retrieved from MongoDB:", result)
//     return JSON.parse(JSON.stringify(result))
//   } catch (error) {
//     console.error("Error fetching all content history:", error)
//     throw new Error(`Failed to fetch all content history: ${error.message}`)
//   }
// }





"use server"
import {
  saveContent,
  getPromptTemplateById,
  getDefaultPromptTemplate,
  getPromptTemplates,
  deletePromptTemplate,
  getContentHistory,
  getContentById,
  deleteContent,
  savePromptTemplate,
  updateContent as updateContentInDb,
  authenticateUser,
  saveAmazonReview,
  getAmazonReviewHistory,
  getAmazonReviewById,
  deleteAmazonReview,
  saveAmazonPromptTemplate,
  getAmazonPromptTemplates,
  deleteAmazonPromptTemplate,
  getDefaultAmazonPromptTemplate,
  getAllContent,
} from "./models"
import https from "https"

// Create a custom HTTPS agent with relaxed SSL options
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // This is less secure but can help bypass SSL issues
})

// Helper function to serialize MongoDB ObjectIds
function serializeMongoData(data) {
  if (!data) return data

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializeMongoData(item))
  }

  // Handle objects
  if (typeof data === "object") {
    // Handle Date objects
    if (data instanceof Date) {
      return data.toISOString()
    }

    // Create a new object to avoid modifying the original
    const serialized = {}

    // Process each property
    for (const [key, value] of Object.entries(data)) {
      // Special handling for MongoDB ObjectId
      if (key === "_id" && typeof value === "object" && value !== null && typeof value.toString === "function") {
        serialized[key] = value.toString()
      } else {
        serialized[key] = serializeMongoData(value)
      }
    }

    return serialized
  }

  // Return primitive values as is
  return data
}

export async function generateContent(params) {
  const { keyword, searchResults } = params

  // Analyze search results
  const analysisData = await analyzeSearchResults(searchResults)

  // Generate content with Gemini
  const generatedContent = await generateContentWithGemini({
    keyword,
    ...analysisData,
  })

  return generatedContent
}

async function analyzeSearchResults(searchResults) {
  const titles = searchResults.map((item) => item.title)
  const snippets = searchResults.map((item) => item.snippet)
  const links = searchResults.map((item) => item.link)

  const allText = [...titles, ...snippets].join(" ")
  const words = allText.toLowerCase().match(/\b\w{4,}\b/g) || []
  const wordFrequency = {}

  words.forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1
  })

  const sortedKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)

  return {
    titles,
    snippets,
    links,
    keywords: sortedKeywords,
    allText,
  }
}

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

  let promptTemplate

  if (promptTemplateId) {
    try {
      promptTemplate = await getPromptTemplateById(promptTemplateId)
    } catch (error) {
      console.error("Error fetching prompt template:", error)
    }
  }

  if (!promptTemplate) {
    promptTemplate = await getDefaultPromptTemplate()
  }

  const imagePrompts = imageResults
    ? imageResults
        .slice(0, 3)
        .map((image, index) => `[IMAGE${index + 1}]: ${image.title}`)
        .join("\n")
    : ""

  // Replace template variables
  const prompt = promptTemplate.template
    .replace("{{keyword}}", keyword)
    .replace("{{keywords}}", keywords ? keywords.join(", ") : keyword)
    .replace("{{titles}}", titles ? titles.slice(0, 5).join("\n") : "")
    .replace("{{snippets}}", snippets ? snippets.slice(0, 5).join("\n") : "")
    .replace("{{imagePrompts}}", imagePrompts)
    .replace("{{contentType}}", contentType || "blog")
    .replace("{{contentLength}}", contentLength || "medium")

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
        // Add custom agent to handle SSL issues
        agent: httpsAgent,
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      throw new Error(`Gemini API responded with status ${response.status}: ${JSON.stringify(errorData)}`)
    }

    const result = await response.json()

    if (!result.candidates || result.candidates.length === 0) {
      console.error("No candidates in Gemini API response")
      throw new Error("Failed to generate content: No candidates returned")
    }

    const generatedText = result.candidates[0].content.parts[0].text

    const titleMatch = generatedText.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : `${keyword} Guide`

    return {
      title,
      content: generatedText,
    }
  } catch (error) {
    console.error("Error in generateContentWithGemini:", error)
    throw new Error(`Failed to generate content: ${error.message}`)
  }
}

export async function searchAndGenerate(params) {
  const { keyword, contentType = "blog", contentLength = "medium", country = "us", promptTemplateId } = params

  try {
    // 1. Search Google
    const { textResults, imageResults } = await searchGoogle(keyword, country)

    if (textResults.length === 0 && imageResults.length === 0) {
      throw new Error("No search results found for this keyword")
    }

    // 2. Analyze search results
    const analysisData = await analyzeSearchResults(textResults)

    // 3. Generate content with Gemini
    const generatedContent = await generateContentWithGemini({
      keyword,
      contentType,
      contentLength,
      promptTemplateId,
      ...analysisData,
      imageResults,
    })

    // 4. Perform SEO analysis
    const seoAnalysis = await performSEOAnalysis(generatedContent.content, keyword)

    // 5. Calculate readability score
    const readabilityScore = calculateReadabilityScore(generatedContent.content)

    // 6. Generate affiliate link suggestions
    const affiliateLinks = await generateAffiliateLinks(keyword)

    // 7. Store in MongoDB
    const contentData = {
      keyword,
      contentType,
      contentLength,
      country,
      title: generatedContent.title,
      content: generatedContent.content,
      seoAnalysis,
      readabilityScore,
      affiliateLinks,
      searchResults: textResults.slice(0, 10),
      imageResults: imageResults.slice(0, 3),
    }

    const savedContent = await saveContent(contentData)
    console.log("Content saved to MongoDB:", savedContent)

    // Serialize the MongoDB ObjectId before returning
    const serializedContent = {
      ...contentData,
      _id: savedContent._id.toString(),
    }

    return serializedContent
  } catch (error) {
    console.error("Error in searchAndGenerate:", error)
    throw new Error(`Failed to generate content: ${error.message}`)
  }
}

async function searchGoogle(keyword, country = "us") {
  // First, search for text results
  const textUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10&gl=${country}`

  // Then, search for image results
  const imageUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10&searchType=image&gl=${country}`

  try {
    const [textResponse, imageResponse] = await Promise.all([
      fetch(textUrl, {
        cache: "no-store",
        agent: httpsAgent, // Add custom agent to handle SSL issues
      }),
      fetch(imageUrl, {
        cache: "no-store",
        agent: httpsAgent, // Add custom agent to handle SSL issues
      }),
    ])

    if (!textResponse.ok) {
      const errorData = await textResponse.json()
      console.error("Google API error (text search):", errorData)
      throw new Error(`Google API responded with status ${textResponse.status}`)
    }

    if (!imageResponse.ok) {
      const errorData = await imageResponse.json()
      console.error("Google API error (image search):", errorData)
      throw new Error(`Google API responded with status ${imageResponse.status}`)
    }

    const textData = await textResponse.json()
    const imageData = await imageResponse.json()

    const textResults = textData.items
      ? textData.items.map((item) => ({
          title: item.title,
          snippet: item.snippet || "",
          link: item.link,
          displayLink: item.displayLink || "",
          formattedUrl: item.formattedUrl || item.link,
        }))
      : []

    const imageResults = imageData.items
      ? imageData.items.map((item) => ({
          title: item.title,
          link: item.link,
          thumbnail: item.image.thumbnailLink,
          context: item.image.contextLink,
        }))
      : []

    return { textResults, imageResults }
  } catch (error) {
    console.error("Error in searchGoogle:", error)
    throw new Error(`Failed to search Google: ${error.message}`)
  }
}

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

async function generateAffiliateLinks(keyword) {
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

export async function createContent(params) {
  const { keyword } = params
  return searchAndGenerate(params)
}

export async function updateContent(params) {
  const { id, content } = params

  try {
    // Update content in MongoDB
    const updated = await updateContentInDb(id, { content })

    if (!updated) {
      throw new Error("Content not found")
    }

    return {
      id,
      content: updated.content,
      updatedAt: updated.updatedAt,
    }
  } catch (error) {
    console.error("Error updating content:", error)
    throw new Error(`Failed to update content: ${error.message}`)
  }
}

// Admin actions for prompt templates
export async function savePromptTemplateAction(template) {
  try {
    const result = await savePromptTemplate(template)
    return serializeMongoData(result)
  } catch (error) {
    console.error("Error saving prompt template:", error)
    throw new Error(`Failed to save prompt template: ${error.message}`)
  }
}

export async function getPromptTemplatesAction() {
  try {
    const templates = await getPromptTemplates()
    // Convert MongoDB objects to plain objects
    return serializeMongoData(templates)
  } catch (error) {
    console.error("Error fetching prompt templates:", error)
    throw new Error(`Failed to fetch prompt templates: ${error.message}`)
  }
}

export async function deletePromptTemplateAction(id) {
  try {
    const result = await deletePromptTemplate(id)
    return result
  } catch (error) {
    console.error("Error deleting prompt template:", error)
    throw new Error(`Failed to delete prompt template: ${error.message}`)
  }
}

// Content history actions
export async function getContentHistoryAction(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit
    const result = await getContentHistory(limit, skip)
    console.log("Content history retrieved from MongoDB:", result)
    return serializeMongoData(result)
  } catch (error) {
    console.error("Error fetching content history:", error)
    throw new Error(`Failed to fetch content history: ${error.message}`)
  }
}

export async function getContentByIdAction(id) {
  try {
    const content = await getContentById(id)
    return serializeMongoData(content)
  } catch (error) {
    console.error("Error fetching content:", error)
    throw new Error(`Failed to fetch content: ${error.message}`)
  }
}

export async function deleteContentAction(id) {
  try {
    const result = await deleteContent(id)
    return result
  } catch (error) {
    console.error("Error deleting content:", error)
    throw new Error(`Failed to delete content: ${error.message}`)
  }
}

// Authentication
export async function authenticate(username, password) {
  try {
    return await authenticateUser(username, password)
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

// Amazon Review Actions
export async function saveAmazonReviewAction(review) {
  try {
    const savedReview = await saveAmazonReview(review)
    return serializeMongoData(savedReview)
  } catch (error) {
    console.error("Error saving Amazon review:", error)
    throw new Error(`Failed to save Amazon review: ${error.message}`)
  }
}

export async function getAmazonReviewHistoryAction(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit
    const result = await getAmazonReviewHistory(limit, skip)
    console.log("Amazon review history retrieved from MongoDB:", result)
    return serializeMongoData(result)
  } catch (error) {
    console.error("Error fetching Amazon review history:", error)
    throw new Error(`Failed to fetch Amazon review history: ${error.message}`)
  }
}

export async function getAmazonReviewByIdAction(id) {
  try {
    const review = await getAmazonReviewById(id)
    return serializeMongoData(review)
  } catch (error) {
    console.error("Error fetching Amazon review:", error)
    throw new Error(`Failed to fetch Amazon review: ${error.message}`)
  }
}

export async function deleteAmazonReviewAction(id) {
  try {
    const result = await deleteAmazonReview(id)
    return result
  } catch (error) {
    console.error("Error deleting Amazon review:", error)
    throw new Error(`Failed to delete Amazon review: ${error.message}`)
  }
}

// Add these Amazon prompt template actions
export async function saveAmazonPromptTemplateAction(template) {
  try {
    const result = await saveAmazonPromptTemplate(template)
    return serializeMongoData(result)
  } catch (error) {
    console.error("Error saving Amazon prompt template:", error)
    throw new Error(`Failed to save Amazon prompt template: ${error.message}`)
  }
}

export async function getAmazonPromptTemplatesAction() {
  try {
    const templates = await getAmazonPromptTemplates()
    return serializeMongoData(templates)
  } catch (error) {
    console.error("Error fetching Amazon prompt templates:", error)
    throw new Error(`Failed to fetch Amazon prompt templates: ${error.message}`)
  }
}

export async function deleteAmazonPromptTemplateAction(id) {
  try {
    const result = await deleteAmazonPromptTemplate(id)
    return result
  } catch (error) {
    console.error("Error deleting Amazon prompt template:", error)
    throw new Error(`Failed to delete Amazon prompt template: ${error.message}`)
  }
}

export async function getDefaultAmazonPromptTemplateAction() {
  try {
    const template = await getDefaultAmazonPromptTemplate()
    return serializeMongoData(template)
  } catch (error) {
    console.error("Error fetching default Amazon prompt template:", error)
    throw new Error(`Failed to fetch default Amazon prompt template: ${error.message}`)
  }
}

// Add a unified content history action
export async function getAllContentHistoryAction(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit
    const result = await getAllContent(limit, skip)
    console.log("All content history retrieved from MongoDB:", result)
    return serializeMongoData(result)
  } catch (error) {
    console.error("Error fetching all content history:", error)
    throw new Error(`Failed to fetch all content history: ${error.message}`)
  }
}

