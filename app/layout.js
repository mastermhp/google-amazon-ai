import { Inter } from "next/font/google"
import "./globals.css"
import MainNav from "./components/main-nav"
// import MainNav from "@/components/main-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Content Generator",
  description: "Generate SEO-optimized content with AI",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-14 items-center">
            <MainNav />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}

