// "use client"
// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { motion } from "framer-motion"
// import { FileText, ShoppingBag, History, Settings, ArrowRight, Sparkles, Zap, Globe, Database } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export default function HomePage() {
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) return null

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.3,
//       },
//     },
//   }

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[90vh] relative">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center mb-12 relative z-10"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="mb-4 inline-block"
//           >
//             <Sparkles className="h-16 w-16 text-blue-500 mb-4 mx-auto" />
//           </motion.div>

//           <h1 className="text-5xl md:text-7xl font-bold mb-6 relative">
//             <span className="glitch" data-text="AI Content Generator">
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
//                 AI Content Generator
//               </span>
//             </span>
//           </h1>

//           <motion.p
//             className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.5 }}
//           >
//             Create SEO-optimized content and product reviews with the power of artificial intelligence
//           </motion.p>
//         </motion.div>

//         <motion.div
//           variants={container}
//           initial="hidden"
//           animate="show"
//           className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl"
//         >
//           <motion.div variants={item} className="relative group futuristic-border">
//             <div className="relative bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl h-full flex flex-col">
//               <div className="flex items-center mb-4">
//                 <div className="p-3 bg-blue-600/30 rounded-lg mr-4 neon-blue-glow">
//                   <FileText className="h-8 w-8 text-blue-400" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-white">Google Content Generator</h2>
//               </div>
//               <p className="text-gray-300 mb-6 flex-grow">
//                 Generate comprehensive, SEO-optimized articles and blog posts based on Google search results. Perfect
//                 for content marketing and SEO.
//               </p>
//               <Link href="/google-content" className="w-full">
//                 <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 group cybr-btn">
//                   Get Started
//                   <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//                 </Button>
//               </Link>
//             </div>
//           </motion.div>

//           <motion.div variants={item} className="relative group futuristic-border">
//             <div className="relative bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl h-full flex flex-col">
//               <div className="flex items-center mb-4">
//                 <div className="p-3 bg-purple-600/30 rounded-lg mr-4 neon-purple-glow">
//                   <ShoppingBag className="h-8 w-8 text-purple-400" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-white">Amazon Review Generator</h2>
//               </div>
//               <p className="text-gray-300 mb-6 flex-grow">
//                 Create detailed product reviews and comparisons based on Amazon products. Ideal for affiliate marketing
//                 and product recommendations.
//               </p>
//               <Link href="/amazon-review" className="w-full">
//                 <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0 group cybr-btn">
//                   Get Started
//                   <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//                 </Button>
//               </Link>
//             </div>
//           </motion.div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.8 }}
//           className="mt-16 text-center"
//         >
//           <h2 className="text-2xl font-bold mb-6 text-gray-200">Additional Features</h2>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Link href="/all-content">
//               <Button
//                 variant="outline"
//                 className="bg-gray-800/50 text-gray-200 border-gray-700 hover:bg-gray-700 hover:text-white"
//               >
//                 <History className="mr-2 h-5 w-5" />
//                 Content History
//               </Button>
//             </Link>
//             <Link href="/admin">
//               <Button
//                 variant="outline"
//                 className="bg-gray-800/50 text-gray-200 border-gray-700 hover:bg-gray-700 hover:text-white"
//               >
//                 <Settings className="mr-2 h-5 w-5" />
//                 Admin Dashboard
//               </Button>
//             </Link>
//           </div>
//         </motion.div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-gray-900/50">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Powerful AI Features</h2>
//             <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//               Our advanced AI technology delivers high-quality content for any purpose
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: <Zap className="h-10 w-10 text-yellow-400" />,
//                 title: "Lightning Fast",
//                 description: "Generate complete articles in seconds with our optimized AI engine",
//                 color: "yellow",
//               },
//               {
//                 icon: <Globe className="h-10 w-10 text-blue-400" />,
//                 title: "SEO Optimized",
//                 description: "Content designed to rank well in search engines with proper keyword density",
//                 color: "blue",
//               },
//               {
//                 icon: <Database className="h-10 w-10 text-green-400" />,
//                 title: "Data-Driven",
//                 description: "Uses real search results and product data to create accurate content",
//                 color: "green",
//               },
//               {
//                 icon: <Sparkles className="h-10 w-10 text-purple-400" />,
//                 title: "Customizable",
//                 description: "Tailor content to your specific needs with adjustable parameters",
//                 color: "purple",
//               },
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//                 className="futuristic-card p-6"
//               >
//                 <div className={`p-4 rounded-full mb-4 inline-block neon-${feature.color}-glow bg-gray-800/50`}>
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
//                 <p className="text-gray-300">{feature.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How It Works</h2>
//             <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//               Simple steps to create amazing content with our AI platform
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 step: "01",
//                 title: "Enter Your Topic",
//                 description: "Type in your keyword or select Amazon products to review",
//                 delay: 0,
//               },
//               {
//                 step: "02",
//                 title: "Customize Options",
//                 description: "Choose content type, length, and other parameters",
//                 delay: 0.2,
//               },
//               {
//                 step: "03",
//                 title: "Generate & Edit",
//                 description: "Our AI creates the content, then you can edit and export",
//                 delay: 0.4,
//               },
//             ].map((step, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, x: -20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: step.delay }}
//                 viewport={{ once: true }}
//                 className="relative"
//               >
//                 <div className="absolute -left-4 -top-4 text-6xl font-bold text-blue-500/20">{step.step}</div>
//                 <div className="futuristic-card p-8 pt-6">
//                   <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
//                   <p className="text-gray-300">{step.description}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gray-900/50">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             viewport={{ once: true }}
//             className="max-w-4xl mx-auto text-center futuristic-border p-[2px] rounded-xl"
//           >
//             <div className="bg-gray-900/80 backdrop-blur-sm p-12 rounded-xl">
//               <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Create Amazing Content?</h2>
//               <p className="text-xl text-gray-300 mb-8">
//                 Start generating SEO-optimized articles and product reviews today
//               </p>
//               <div className="flex flex-wrap justify-center gap-4">
//                 <Link href="/google-content">
//                   <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 cybr-btn">
//                     <FileText className="mr-2 h-5 w-5" />
//                     Generate Google Content
//                   </Button>
//                 </Link>
//                 <Link href="/amazon-review">
//                   <Button className="bg-purple-600 hover:bg-purple-700 text-white border-0 cybr-btn">
//                     <ShoppingBag className="mr-2 h-5 w-5" />
//                     Generate Amazon Reviews
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   )
// }



"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, ShoppingBag, History, Settings, ArrowRight, Sparkles, Zap, Globe, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedIcon } from "./components/animated-icon"
import { HeroSection } from "./components/hero-section"
import { FuturisticFooter } from "./components/futuristic-footer"


export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // This runs only on the client, after hydration
    setMounted(true)
  }, [])

  // Only render the UI after client-side hydration is complete
  if (!mounted) {
    return <div className="min-h-screen bg-background"></div> // Return a minimal placeholder
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Now using our new enhanced component */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Powerful AI Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our advanced AI technology delivers high-quality content for any purpose
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Generate complete articles in seconds with our optimized AI engine",
                color: "yellow",
                animation: "pulse",
              },
              {
                icon: Globe,
                title: "SEO Optimized",
                description: "Content designed to rank well in search engines with proper keyword density",
                color: "blue",
                animation: "spin",
              },
              {
                icon: Database,
                title: "Data-Driven",
                description: "Uses real search results and product data to create accurate content",
                color: "green",
                animation: "bounce",
              },
              {
                icon: Sparkles,
                title: "Customizable",
                description: "Tailor content to your specific needs with adjustable parameters",
                color: "purple",
                animation: "float",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="futuristic-card p-6"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`p-4 rounded-full mb-4 inline-block neon-${feature.color}-glow bg-gray-800/50`}>
                  <AnimatedIcon
                    icon={feature.icon}
                    className={`h-10 w-10 text-${feature.color}-400`}
                    size={40}
                    animation={feature.animation}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple steps to create amazing content with our AI platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Enter Your Topic",
                description: "Type in your keyword or select Amazon products to review",
                delay: 0,
                icon: FileText,
                animation: "float",
              },
              {
                step: "02",
                title: "Customize Options",
                description: "Choose content type, length, and other parameters",
                delay: 0.2,
                icon: Settings,
                animation: "pulse",
              },
              {
                step: "03",
                title: "Generate & Edit",
                description: "Our AI creates the content, then you can edit and export",
                delay: 0.4,
                icon: Sparkles,
                animation: "bounce",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: step.delay }}
                viewport={{ once: true }}
                className="relative"
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className="absolute -left-4 -top-4 text-6xl font-bold text-blue-500/20">{step.step}</div>
                <div className="futuristic-card p-8 pt-6">
                  <div className="flex justify-center mb-4">
                    <AnimatedIcon
                      icon={step.icon}
                      className="h-12 w-12 text-blue-400"
                      size={48}
                      animation={step.animation}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white text-center">{step.title}</h3>
                  <p className="text-gray-300 text-center">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center futuristic-border p-[2px] rounded-xl"
          >
            <div className="bg-gray-900/80 backdrop-blur-sm p-12 rounded-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Create Amazing Content?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Start generating SEO-optimized articles and product reviews today
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/google-content">
                  <Button variant="cyber" className="group">
                    <AnimatedIcon icon={FileText} className="mr-2 h-5 w-5" size={20} animation="pulse" />
                    Generate Google Content
                  </Button>
                </Link>
                <Link href="/amazon-review">
                  <Button variant="glitch" className="group">
                    <AnimatedIcon icon={ShoppingBag} className="mr-2 h-5 w-5" size={20} animation="bounce" />
                    Generate Amazon Reviews
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Now using our new enhanced component */}
      <FuturisticFooter />
    </div>
  )
}

