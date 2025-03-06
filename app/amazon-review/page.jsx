"use client"
import { useState } from "react"
import { Search, Star, Award, ShoppingBag, Truck } from "lucide-react"
// import AmazonContentGenerator from "@/components/amazon-content-generator"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AmazonContentGenerator from "../components/amazon-content-generator"

export default function AmazonReview() {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showContentGenerator, setShowContentGenerator] = useState(false)

  const fetchProducts = async () => {
    if (!query.trim()) return alert("Please enter a search term.")

    setLoading(true)
    setError(null)
    setShowContentGenerator(false)

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data.products)
      if (data.products.length === 0) {
        setError("No products found. Try a different search term.")
      } else {
        setShowContentGenerator(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchProducts()
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">AI Amazon Product Review Generator</h1>
      <p className="text-center text-gray-600 mb-6">
        Search for products, generate comprehensive reviews with SEO optimization
      </p>

      <Card className="shadow-md mb-8">
        <CardContent className="p-6">
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-10"
                placeholder="Search for Amazon products to review..."
              />
            </div>
            <Button onClick={fetchProducts} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {products.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Found Products ({products.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {products.map((product, index) => (
              <Card key={index} className="overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                  {product.isBestSeller && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded flex items-center">
                      <Award size={14} className="mr-1" />
                      Best Seller
                    </div>
                  )}
                  {product.isAmazonChoice && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Amazon's Choice
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12">{product.title}</h3>

                  {product.rating && (
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < Math.floor(Number.parseFloat(product.rating))
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.numRatings?.toLocaleString() || "0"})
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline mb-2">
                    <span className="text-lg font-bold text-gray-900 mr-2">{product.price || "N/A"}</span>
                    {product.originalPrice && product.originalPrice !== product.price && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>

                  {product.isPrime && (
                    <div className="flex items-center text-sm text-blue-800 mb-2">
                      <ShoppingBag size={14} className="mr-1" />
                      Prime
                    </div>
                  )}

                  {product.delivery && (
                    <div className="flex items-center text-xs text-gray-600 mb-3">
                      <Truck size={14} className="mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{product.delivery}</span>
                    </div>
                  )}

                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 px-4 rounded transition-colors mt-2"
                  >
                    View on Amazon
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {showContentGenerator && <AmazonContentGenerator products={products} />}
        </>
      )}
    </div>
  )
}

