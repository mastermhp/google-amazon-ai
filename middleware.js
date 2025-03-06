// import { NextResponse } from "next/server"

// export function middleware(request) {
//   // Add CORS headers to allow API requests from other domains
//   const response = NextResponse.next()

//   // Only add CORS headers for API routes
//   if (request.nextUrl.pathname.startsWith("/api/")) {
//     response.headers.set("Access-Control-Allow-Origin", "*")
//     response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
//     response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
//   }

//   return response
// }

// export const config = {
//   matcher: ["/api/:path*"],
// }


// import { NextResponse } from "next/server"
// import { getToken } from "next-auth/jwt"

// export async function middleware(request) {
//   // Add CORS headers to allow API requests from other domains
//   const response = NextResponse.next()

//   // Only add CORS headers for API routes
//   if (request.nextUrl.pathname.startsWith("/api/")) {
//     response.headers.set("Access-Control-Allow-Origin", "*")
//     response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
//     response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
//   }

//   // Protect admin routes
//   if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
//     const token = await getToken({ req: request })

//     if (!token) {
//       return NextResponse.redirect(new URL("/admin/login", request.url))
//     }
//   }

//   return response
// }

// export const config = {
//   matcher: ["/api/:path*", "/admin/:path*"],
// }



import { NextResponse } from "next/server"

export async function middleware(request) {
  // Add CORS headers to allow API requests from other domains
  const response = NextResponse.next()

  // Only add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }

  return response
}

export const config = {
  matcher: ["/api/:path*"],
}


