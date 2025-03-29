import { Inter } from "next/font/google"
import "./globals.css"
import MainNav from "./components/main-nav"
import { AnimatedBackground } from "./components/animated-background"
import { ThemeProvider } from "./components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Content Generator",
  description: "Generate SEO-optimized content with AI",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AnimatedBackground />
          <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
              <MainNav />
            </div>
          </header>
          <main className="relative z-10">{children}</main>
          <div className="futuristic-grid absolute inset-0 z-0 opacity-20"></div>
        </ThemeProvider>
      </body>
    </html>
  )
}


