/**
 * Analyze search results to extract keywords and insights
 * @param {Array} searchResults - The search results to analyze
 * @returns {Object} Analysis data including keywords, titles, snippets
 */
export async function analyzeSearchResults(searchResults) {
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
  
  /**
   * Perform SEO analysis on content
   * @param {string} content - The content to analyze
   * @param {string} keyword - The main keyword
   * @returns {Object} SEO analysis metrics
   */
  export function performSEOAnalysis(content, keyword) {
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
  
  /**
   * Calculate readability score for content
   * @param {string} content - The content to analyze
   * @returns {string} Readability score
   */
  export function calculateReadabilityScore(content) {
    const sentences = content.split(/[.!?]+\s/).length
    const words = content.split(/\s+/).length
    const syllables = content.split(/\s+/).reduce((count, word) => {
      return count + (word.match(/[aeiou]/gi) || []).length
    }, 0)
  
    const fleschKincaid = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    return Math.max(0, Math.min(100, fleschKincaid)).toFixed(1)
  }
  
  