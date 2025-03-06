import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") // Get search term

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    console.log("Fetching data for:", query)

    // Use the search query in the API request
    const options = {
      method: "GET",
      url: "https://real-time-amazon-data.p.rapidapi.com/search",
      params: {
        query: query,
        page: "1",
        country: "US",
        category_id: "aps",
      },
      headers: {
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
        "x-rapidapi-key": "5893b69756mshead2ba63492b78bp151496jsn0d319d686f37",
      },
    }

    const response = await axios.request(options)

    // Log a sample product to see its structure
    if (response.data?.data?.products?.length > 0) {
      console.log("Sample product:", JSON.stringify(response.data.data.products[0], null, 2))
    }

    if (response.status !== 200) {
      return NextResponse.json({ error: "API request failed" }, { status: response.status })
    }

    // Extract relevant product details from the API response
    const products = response.data?.data?.products
      ? response.data.data.products.map((product) => ({
          asin: product.asin,
          title: product.product_title,
          price: product.product_price,
          originalPrice: product.product_original_price,
          image: product.product_photo,
          url: product.product_url,
          rating: product.product_star_rating,
          numRatings: product.product_num_ratings,
          isBestSeller: product.is_best_seller,
          isAmazonChoice: product.is_amazon_choice,
          isPrime: product.is_prime,
          delivery: product.delivery,
        }))
      : []

    // Limit to top 10 products
    const topProducts = products.slice(0, 10)

    return NextResponse.json({ products: topProducts })
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message)
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch products",
        details: error.response?.data,
      },
      { status: 500 },
    )
  }
}

