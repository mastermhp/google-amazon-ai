// "use server"

// import { revalidatePath } from "next/cache"

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
//   const { keyword, keywords, titles, snippets } = data

//   const prompt = `
//     Create a comprehensive, SEO-optimized blog post about "${keyword}".
    
//     Use these keywords: ${keywords.join(", ")}
    
//     Based on these titles from top search results:
//     ${titles.slice(0, 5).join("\n")}
    
//     And these snippets:
//     ${snippets.slice(0, 5).join("\n")}
    
//     The content should be well-structured with headings and subheadings,
//     and include an introduction and conclusion.
    
//     Also generate a meta description for SEO purposes.
//   `


//   try {
//     const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-goog-api-key": process.env.GEMINI_API_KEY,
//       },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }],
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.95,
//           maxOutputTokens: 8192,
//         },
//       }),
//     })

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

// export async function createContent(params) {
//   const { keyword, additionalInfo, contentType, contentLength } = params

//   // 1. Search Google
//   const searchResults = await searchGoogle(keyword)

//   // 2. Analyze search results
//   const analysisData = await analyzeSearchResults(searchResults)

//   // 3. Generate content with Gemini
//   const generatedContent = await generateContentWithGemini({
//     keyword,
//     additionalInfo,
//     contentType,
//     contentLength,
//     ...analysisData,
//   })

//   // 4. Store in database (you'll need to implement this)
//   const contentId = await saveContentToDatabase({
//     keyword,
//     ...generatedContent,
//     createdAt: new Date().toISOString(),
//   })

//   // Revalidate the dashboard page
//   revalidatePath("/dashboard")

//   return contentId
// }

// async function searchGoogle(keyword) {
//   const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10`

//   const response = await fetch(url)
//   const data = await response.json()

//   if (!data.items) {
//     throw new Error("No search results found")
//   }

//   return data.items
// }

// async function saveContentToDatabase(content) {
//   // This is a placeholder function. You need to implement the actual database saving logic.
//   // For example, using Prisma or another ORM to save to your database.
//   console.log("Saving content to database:", content)
//   return "generated-id-" + Math.random().toString(36).substr(2, 9)
// }




// "use server"

// import { revalidatePath } from "next/cache"

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
//   const { keyword, keywords, titles, snippets, links } = data

//   const prompt = `
//     As an SEO expert and content writer, create a comprehensive, SEO-optimized article about "${keyword}".
    
//     Use these keywords prominently throughout the content: ${keywords.join(", ")}
    
//     Analyze and incorporate insights from these top search results:
//     ${titles.map((title, i) => `${i + 1}. ${title}\n   ${snippets[i]}\n   ${links[i]}`).join("\n\n")}
    
//     Your task is to:
//     1. Write a compelling title that includes the main keyword.
//     2. Create an introduction that hooks the reader and introduces the topic.
//     3. Develop 3-5 main sections with appropriate H2 headings.
//     4. Include relevant statistics, examples, or quotes from the search results to support your points.
//     5. Use bullet points or numbered lists where appropriate to improve readability.
//     6. Conclude with a summary and a call-to-action.
//     7. Add a meta description for SEO purposes (limit to 155 characters).
    
//     The content should be well-structured, informative, and engaging, with a word count of approximately 1000-1500 words.
//     Format the content in HTML, using appropriate tags (<h1>, <h2>, <p>, <ul>, <ol>, etc.).
//   `

//   try {
//     const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-goog-api-key": process.env.GEMINI_API_KEY,
//       },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }],
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.95,
//           maxOutputTokens: 8192,
//         },
//       }),
//     })

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

//     // Extract title and meta description
//     const titleMatch = generatedText.match(/<h1>(.*?)<\/h1>/)
//     const metaDescriptionMatch = generatedText.match(/<meta name="description" content="(.*?)">/)

//     const title = titleMatch ? titleMatch[1] : `${keyword} Guide`
//     const metaDescription = metaDescriptionMatch ? metaDescriptionMatch[1] : ""

//     // Remove the meta description from the content
//     const content = generatedText.replace(/<meta name="description" content=".*?">/, "")

//     return {
//       title,
//       content,
//       metaDescription,
//       keywords,
//       searchResults: titles.map((title, i) => ({ title, snippet: snippets[i], link: links[i] })),
//     }
//   } catch (error) {
//     console.error("Error in generateContentWithGemini:", error)
//     throw new Error(`Failed to generate content: ${error.message}`)
//   }
// }

// export async function createContent(params) {
//   const { keyword, additionalInfo, contentType, contentLength } = params

//   // 1. Search Google
//   const searchResults = await searchGoogle(keyword)

//   // 2. Analyze search results
//   const analysisData = await analyzeSearchResults(searchResults)

//   // 3. Generate content with Gemini
//   const generatedContent = await generateContentWithGemini({
//     keyword,
//     additionalInfo,
//     contentType,
//     contentLength,
//     ...analysisData,
//   })

//   // 4. Store in database (you'll need to implement this)
//   const contentId = await saveContentToDatabase({
//     keyword,
//     ...generatedContent,
//     createdAt: new Date().toISOString(),
//   })

//   // Revalidate the dashboard page
//   revalidatePath("/dashboard")

//   return contentId
// }

// async function searchGoogle(keyword) {
//   const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10`

//   const response = await fetch(url)
//   const data = await response.json()

//   if (!data.items) {
//     throw new Error("No search results found")
//   }

//   return data.items
// }

// async function saveContentToDatabase(content) {
//   // This is a placeholder function. You need to implement the actual database saving logic.
//   // For example, using Prisma or another ORM to save to your database.
//   console.log("Saving content to database:", content)
//   return "generated-id-" + Math.random().toString(36).substr(2, 9)
// }


// "use server"

// import { revalidatePath } from "next/cache"

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
//   const { keyword, keywords, titles, snippets } = data

//   const prompt = `
//     Create a comprehensive, SEO-optimized blog post about "${keyword}".
    
//     Use these keywords: ${keywords.join(", ")}
    
//     Based on these titles from top search results:
//     ${titles.slice(0, 5).join("\n")}
    
//     And these snippets:
//     ${snippets.slice(0, 5).join("\n")}
    
//     The content should be well-structured with headings and subheadings,
//     and include an introduction and conclusion.
    
//     Also generate a meta description for SEO purposes.
//   `

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
//   const { keyword, contentType = "blog", contentLength = "medium" } = params

//   try {
//     // 1. Search Google
//     const searchResults = await searchGoogle(keyword)

//     if (!searchResults || searchResults.length === 0) {
//       throw new Error("No search results found for this keyword")
//     }

//     // 2. Analyze search results
//     const analysisData = await analyzeSearchResults(searchResults)

//     // 3. Generate content with Gemini
//     const generatedContent = await generateContentWithGemini({
//       keyword,
//       contentType,
//       contentLength,
//       ...analysisData,
//     })

//     // 4. Store in database (optional)
//     // const contentId = await saveContentToDatabase({
//     //   keyword,
//     //   ...generatedContent,
//     //   createdAt: new Date().toISOString(),
//     // })

//     // Revalidate the dashboard page
//     revalidatePath("/dashboard")

//     return {
//       title: generatedContent.title,
//       content: generatedContent.content,
//       searchResults: searchResults.slice(0, 5), // Return top 5 search results
//     }
//   } catch (error) {
//     console.error("Error in searchAndGenerate:", error)
//     throw new Error(`Failed to generate content: ${error.message}`)
//   }
// }

// async function searchGoogle(keyword) {
//   const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10`

//   try {
//     const response = await fetch(url, { cache: "no-store" })

//     if (!response.ok) {
//       const errorData = await response.json()
//       console.error("Google API error:", errorData)
//       throw new Error(`Google API responded with status ${response.status}`)
//     }

//     const data = await response.json()

//     if (!data.items) {
//       console.warn("No search results found for:", keyword)
//       return []
//     }

//     return data.items.map((item) => ({
//       title: item.title,
//       snippet: item.snippet || "",
//       link: item.link,
//       displayLink: item.displayLink || "",
//       formattedUrl: item.formattedUrl || item.link,
//     }))
//   } catch (error) {
//     console.error("Error in searchGoogle:", error)
//     throw new Error(`Failed to search Google: ${error.message}`)
//   }
// }

// export async function createContent(params) {
//   const { keyword } = params
//   return searchAndGenerate(params)
// }


// ok 

// "use server"

// import { revalidatePath } from "next/cache"

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
//   const { keyword, keywords, titles, snippets, contentType, contentLength } = data

//   const prompt = `
//     Create a comprehensive, SEO-optimized ${contentType} about "${keyword}".
    
//     Use these keywords: ${keywords.join(", ")}
    
//     Based on these titles from top search results:
//     ${titles.slice(0, 5).join("\n")}
    
//     And these snippets:
//     ${snippets.slice(0, 5).join("\n")}
    
//     The content should be well-structured with headings and subheadings,
//     and include an introduction and conclusion.
    
//     Content length should be ${contentLength} (short: ~300 words, medium: ~600 words, long: ~1000 words).
    
//     Also generate a meta description for SEO purposes.
//   `

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
//   const { keyword, contentType = "blog", contentLength = "medium" } = params

//   try {
//     // 1. Search Google
//     const searchResults = await searchGoogle(keyword)

//     if (!searchResults || searchResults.length === 0) {
//       throw new Error("No search results found for this keyword")
//     }

//     // 2. Analyze search results
//     const analysisData = await analyzeSearchResults(searchResults)

//     // 3. Generate content with Gemini
//     const generatedContent = await generateContentWithGemini({
//       keyword,
//       contentType,
//       contentLength,
//       ...analysisData,
//     })

//     // 4. Perform SEO analysis
//     const seoAnalysis = await performSEOAnalysis(generatedContent.content, keyword)

//     // 5. Calculate readability score
//     const readabilityScore = calculateReadabilityScore(generatedContent.content)

//     // 6. Generate affiliate link suggestions
//     const affiliateLinks = await generateAffiliateLinks(keyword)

//     // 7. Store in database (optional)
//     // const contentId = await saveContentToDatabase({
//     //   keyword,
//     //   ...generatedContent,
//     //   seoAnalysis,
//     //   readabilityScore,
//     //   affiliateLinks,
//     //   createdAt: new Date().toISOString(),
//     // })

//     // Revalidate the dashboard page
//     revalidatePath("/dashboard")

//     return {
//       title: generatedContent.title,
//       content: generatedContent.content,
//       searchResults: searchResults.slice(0, 10), // Return top 10 search results
//       seoAnalysis,
//       readabilityScore,
//       affiliateLinks,
//     }
//   } catch (error) {
//     console.error("Error in searchAndGenerate:", error)
//     throw new Error(`Failed to generate content: ${error.message}`)
//   }
// }

// async function searchGoogle(keyword) {
//   const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10`

//   try {
//     const response = await fetch(url, { cache: "no-store" })

//     if (!response.ok) {
//       const errorData = await response.json()
//       console.error("Google API error:", errorData)
//       throw new Error(`Google API responded with status ${response.status}`)
//     }

//     const data = await response.json()

//     if (!data.items) {
//       console.warn("No search results found for:", keyword)
//       return []
//     }

//     return data.items.map((item) => ({
//       title: item.title,
//       snippet: item.snippet || "",
//       link: item.link,
//       displayLink: item.displayLink || "",
//       formattedUrl: item.formattedUrl || item.link,
//     }))
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

//   // Here you would update the content in your database
//   // For now, we'll just return the updated content
//   return {
//     id,
//     content,
//     updatedAt: new Date().toISOString(),
//   }
// }






// images 

// "use server"

// import { revalidatePath } from "next/cache"

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
//   const { keyword, keywords, titles, snippets, contentType, contentLength, imageResults } = data

//   const imagePrompts = imageResults
//     .slice(0, 3)
//     .map((image, index) => `[IMAGE${index + 1}]: ${image.title}`)
//     .join("\n")

//   const prompt = `
//     Create a comprehensive, SEO-optimized ${contentType} about "${keyword}".
    
//     Use these keywords: ${keywords.join(", ")}
    
//     Based on these titles from top search results:
//     ${titles.slice(0, 5).join("\n")}
    
//     And these snippets:
//     ${snippets.slice(0, 5).join("\n")}
    
//     Include the following image placeholders in appropriate places within the content:
//     ${imagePrompts}
    
//     The content should be well-structured with headings and subheadings,
//     and include an introduction and conclusion.
    
//     Content length should be ${contentLength} (short: ~800 words, medium: ~1200 words, long: ~2000 words).
    
//     Also generate a meta description for SEO purposes.
//   `

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
//   const { keyword, contentType = "blog", contentLength = "medium" } = params

//   try {
//     // 1. Search Google
//     const { textResults, imageResults } = await searchGoogle(keyword)

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
//       ...analysisData,
//       imageResults,
//     })

//     // 4. Perform SEO analysis
//     const seoAnalysis = await performSEOAnalysis(generatedContent.content, keyword)

//     // 5. Calculate readability score
//     const readabilityScore = calculateReadabilityScore(generatedContent.content)

//     // 6. Generate affiliate link suggestions
//     const affiliateLinks = await generateAffiliateLinks(keyword)

//     // 7. Store in database (optional)
//     // const contentId = await saveContentToDatabase({
//     //   keyword,
//     //   ...generatedContent,
//     //   seoAnalysis,
//     //   readabilityScore,
//     //   affiliateLinks,
//     //   createdAt: new Date().toISOString(),
//     // })

//     // Revalidate the dashboard page
//     revalidatePath("/dashboard")

//     return {
//       title: generatedContent.title,
//       content: generatedContent.content,
//       searchResults: textResults.slice(0, 10), // Return top 10 search results
//       imageResults: imageResults.slice(0, 3), // Return top 3 image results
//       seoAnalysis,
//       readabilityScore,
//       affiliateLinks,
//     }
//   } catch (error) {
//     console.error("Error in searchAndGenerate:", error)
//     throw new Error(`Failed to generate content: ${error.message}`)
//   }
// }

// async function searchGoogle(keyword) {
//   const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10&searchType=image`

//   try {
//     const response = await fetch(url, { cache: "no-store" })

//     if (!response.ok) {
//       const errorData = await response.json()
//       console.error("Google API error:", errorData)
//       throw new Error(`Google API responded with status ${response.status}`)
//     }

//     const data = await response.json()

//     if (!data.items) {
//       console.warn("No search results found for:", keyword)
//       return { textResults: [], imageResults: [] }
//     }

//     const textResults = data.items.map((item) => ({
//       title: item.title,
//       snippet: item.snippet || "",
//       link: item.link,
//       displayLink: item.displayLink || "",
//       formattedUrl: item.formattedUrl || item.link,
//     }))

//     const imageResults = data.items.map((item) => ({
//       title: item.title,
//       link: item.link,
//       thumbnail: item.image.thumbnailLink,
//       context: item.image.contextLink,
//     }))

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

//   // Here you would update the content in your database
//   // For now, we'll just return the updated content
//   return {
//     id,
//     content,
//     updatedAt: new Date().toISOString(),
//   }
// }


// database local

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
//   updateContent as updateContentInStore,
// } from "./store"
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

//     // 7. Store in memory/localStorage
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

//     const savedContent = saveContent(contentData)
//     console.log("Content saved:", savedContent)

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
//     // Update content in memory/localStorage
//     const updated = updateContentInStore(id, { content })

//     if (!updated) {
//       throw new Error("Content not found")
//     }

//     return {
//       id,
//       content,
//       updatedAt: new Date().toISOString(),
//     }
//   } catch (error) {
//     console.error("Error updating content:", error)
//     throw new Error(`Failed to update content: ${error.message}`)
//   }
// }

// // Admin actions for prompt templates
// export async function savePromptTemplateAction(template) {
//   try {
//     const result = savePromptTemplate(template)
//     return result
//   } catch (error) {
//     console.error("Error saving prompt template:", error)
//     throw new Error(`Failed to save prompt template: ${error.message}`)
//   }
// }

// export async function getPromptTemplatesAction() {
//   try {
//     return getPromptTemplates()
//   } catch (error) {
//     console.error("Error fetching prompt templates:", error)
//     throw new Error(`Failed to fetch prompt templates: ${error.message}`)
//   }
// }

// export async function deletePromptTemplateAction(id) {
//   try {
//     const result = deletePromptTemplate(id)
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
//     const result = getContentHistory(limit, skip)
//     console.log("Content history retrieved:", result)
//     return result
//   } catch (error) {
//     console.error("Error fetching content history:", error)
//     throw new Error(`Failed to fetch content history: ${error.message}`)
//   }
// }

// export async function getContentByIdAction(id) {
//   try {
//     return getContentById(id)
//   } catch (error) {
//     console.error("Error fetching content:", error)
//     throw new Error(`Failed to fetch content: ${error.message}`)
//   }
// }

// export async function deleteContentAction(id) {
//   try {
//     const result = deleteContent(id)
//     return result
//   } catch (error) {
//     console.error("Error deleting content:", error)
//     throw new Error(`Failed to delete content: ${error.message}`)
//   }
// }






// mongodb 


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




// with amazon 


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












// amazon prompts 

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

    return {
      ...contentData,
      _id: savedContent._id,
    }
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
    return result
  } catch (error) {
    console.error("Error saving prompt template:", error)
    throw new Error(`Failed to save prompt template: ${error.message}`)
  }
}

export async function getPromptTemplatesAction() {
  try {
    return await getPromptTemplates()
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
    return result
  } catch (error) {
    console.error("Error fetching content history:", error)
    throw new Error(`Failed to fetch content history: ${error.message}`)
  }
}

export async function getContentByIdAction(id) {
  try {
    return await getContentById(id)
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
    return savedReview
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
    return result
  } catch (error) {
    console.error("Error fetching Amazon review history:", error)
    throw new Error(`Failed to fetch Amazon review history: ${error.message}`)
  }
}

export async function getAmazonReviewByIdAction(id) {
  try {
    return await getAmazonReviewById(id)
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
    return result
  } catch (error) {
    console.error("Error saving Amazon prompt template:", error)
    throw new Error(`Failed to save Amazon prompt template: ${error.message}`)
  }
}

export async function getAmazonPromptTemplatesAction() {
  try {
    return await getAmazonPromptTemplates()
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
    return await getDefaultAmazonPromptTemplate()
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
    return result
  } catch (error) {
    console.error("Error fetching all content history:", error)
    throw new Error(`Failed to fetch all content history: ${error.message}`)
  }
}

