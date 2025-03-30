import https from "https"

// Create a custom HTTPS agent with relaxed SSL options and timeout
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  timeout: 8000,
})

/**
 * Search Google for text and image results
 * @param {string} keyword - The search keyword
 * @param {string} country - The country code for search
 * @param {number} numResults - Number of results to return
 * @returns {Promise<{textResults: Array, imageResults: Array}>}
 */
export async function searchGoogle(keyword, country = "us", numResults = 5) {
  // First, search for text results
  const textUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=10&gl=${country}`

  // Then, search for image results
  const imageUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(keyword)}&num=3&searchType=image&gl=${country}`

  try {
    const [textResponse, imageResponse] = await Promise.all([
      fetchWithTimeout(
        textUrl,
        {
          cache: "no-store",
          agent: httpsAgent,
        },
        8000,
      ),
      fetchWithTimeout(
        imageUrl,
        {
          cache: "no-store",
          agent: httpsAgent,
        },
        8000,
      ),
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
    // Return empty results instead of throwing
    return { textResults: [], imageResults: [] }
  }
}

// Helper function for timeout handling
const fetchWithTimeout = async (url, options, timeout = 8000) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

