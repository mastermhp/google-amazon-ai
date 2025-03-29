"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import {
  FileText,
  ShoppingBag,
  History,
  Settings,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Globe,
  ArrowUp,
  Sparkles,
  Code,
  Cpu,
  Zap,
} from "lucide-react"
import { AnimatedIcon } from "./animated-icon"

export function FuturisticFooter() {
  const [isVisible, setIsVisible] = useState(false)
  const controls = useAnimation()

  // Detect scroll position to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Animate grid items when they become visible
  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }))
  }, [controls])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const footerLinks = [
    {
      title: "Content Generation",
      links: [
        { name: "Google Content", href: "/google-content", icon: FileText },
        { name: "Amazon Reviews", href: "/amazon-review", icon: ShoppingBag },
        { name: "Content History", href: "/history", icon: History },
        { name: "Admin Dashboard", href: "/admin", icon: Settings },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#", icon: FileText },
        { name: "API Reference", href: "#", icon: Code },
        { name: "Examples", href: "#", icon: Globe },
        { name: "Tutorials", href: "#", icon: Cpu },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#", icon: Globe },
        { name: "Contact", href: "#", icon: Mail },
        { name: "Privacy Policy", href: "#", icon: FileText },
        { name: "Terms of Service", href: "#", icon: FileText },
      ],
    },
  ]

  const socialLinks = [
    { name: "GitHub", href: "#", icon: Github, color: "text-white" },
    { name: "Twitter", href: "#", icon: Twitter, color: "text-blue-400" },
    { name: "LinkedIn", href: "#", icon: Linkedin, color: "text-blue-500" },
    { name: "Email", href: "mailto:info@example.com", icon: Mail, color: "text-purple-400" },
  ]

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/30"></div>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, rgba(84,33,128,0.8) 0%, rgba(84,33,128,0) 70%)`,
              width: `${Math.random() * 30 + 20}rem`,
              height: `${Math.random() * 30 + 20}rem`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#542180_1px,transparent_1px),linear-gradient(to_bottom,#542180_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and description */}
          <div className="space-y-6">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-full bg-primary p-2 shadow-lg shadow-primary/50">
                <AnimatedIcon icon={Sparkles} className="h-6 w-6 text-white" animation="pulse" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-primary">AI</span>
                <span className="text-white">Content</span>
              </span>
            </motion.div>

            <motion.p
              className="text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Cutting-edge AI technology for generating SEO-optimized content and product reviews. Elevate your content
              strategy with our advanced tools.
            </motion.p>

            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {socialLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`${link.color} hover:text-primary transition-colors duration-300`}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <link.icon size={20} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              className="space-y-6"
              custom={sectionIndex + 1}
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
            >
              <h3 className="text-lg font-semibold text-white relative inline-block">
                {section.title}
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: (sectionIndex + 1) * 0.2, duration: 0.5 }}
                />
              </h3>

              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.1 + linkIndex * 0.05 + 0.3, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary flex items-center group transition-colors duration-300"
                    >
                      <motion.span className="mr-2 text-gray-500 group-hover:text-primary" whileHover={{ rotate: 15 }}>
                        <link.icon size={16} />
                      </motion.span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Animated divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <motion.div
              className="px-4 bg-gray-950 flex space-x-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <AnimatedIcon icon={Zap} className="text-primary" size={20} animation="pulse" />
              <AnimatedIcon icon={Cpu} className="text-blue-400" size={20} animation="float" />
              <AnimatedIcon icon={Code} className="text-purple-400" size={20} animation="bounce" />
            </motion.div>
          </div>
        </div>

        {/* Copyright and back to top */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8">
          <motion.p
            className="text-gray-500 text-sm mb-4 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            © {new Date().getFullYear()} AI Content Generator. All rights reserved.
          </motion.p>

          <motion.button
            onClick={scrollToTop}
            className={`group bg-gray-900 border border-gray-800 p-3 rounded-full hover:bg-primary hover:border-primary transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUp className="h-5 w-5 text-gray-400 group-hover:text-white" />
          </motion.button>
        </div>
      </div>

      {/* Glowing border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
    </footer>
  )
}

