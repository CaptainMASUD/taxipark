"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Menu,
  X,
  Bell,
  User,
  Globe,
  Calendar,
  Clock,
  TrendingUp,
  Play,
  Share2,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Sun,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from "lucide-react"
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa"

// Mock data for demonstration
const mockNews = {
  breaking: [
    {
      id: 1,
      title: "Global Climate Summit Reaches Historic Agreement",
      summary: "World leaders unite on unprecedented climate action plan with binding commitments for 2030.",
      image: "/placeholder.svg?height=400&width=600",
      category: "World",
      author: "Sarah Johnson",
      time: "2 minutes ago",
      isBreaking: true,
    },
    {
      id: 2,
      title: "Tech Giants Face New Regulatory Challenges",
      summary:
        "Major technology companies prepare for stricter data privacy regulations across multiple jurisdictions.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Technology",
      author: "Michael Chen",
      time: "15 minutes ago",
      isBreaking: true,
    },
    {
      id: 3,
      title: "Olympic Games Set New Viewership Records",
      summary: "International sporting event attracts global audience with innovative broadcasting technology.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Sports",
      author: "Emma Rodriguez",
      time: "1 hour ago",
      isBreaking: false,
    },
  ],
  categories: {
    politics: [
      {
        id: 4,
        title: "Senate Passes Infrastructure Bill",
        summary: "Bipartisan legislation allocates $1.2 trillion for roads, bridges, and broadband expansion.",
        image: "/placeholder.svg?height=200&width=300",
        author: "David Wilson",
        time: "3 hours ago",
      },
      {
        id: 5,
        title: "International Trade Negotiations Continue",
        summary: "Diplomatic talks focus on reducing tariffs and improving economic cooperation.",
        image: "/placeholder.svg?height=200&width=300",
        author: "Lisa Park",
        time: "5 hours ago",
      },
    ],
    business: [
      {
        id: 6,
        title: "Stock Markets Reach All-Time Highs",
        summary: "Major indices surge following positive economic indicators and corporate earnings.",
        image: "/placeholder.svg?height=200&width=300",
        author: "Robert Kim",
        time: "1 hour ago",
      },
      {
        id: 7,
        title: "Cryptocurrency Regulation Framework Proposed",
        summary: "Financial authorities outline comprehensive guidelines for digital asset trading.",
        image: "/placeholder.svg?height=200&width=300",
        author: "Jennifer Lee",
        time: "4 hours ago",
      },
    ],
    technology: [
      {
        id: 8,
        title: "AI Breakthrough in Medical Diagnosis",
        summary: "Machine learning algorithm demonstrates 95% accuracy in early disease detection.",
        image: "/placeholder.svg?height=200&width=300",
        author: "Dr. Alex Thompson",
        time: "2 hours ago",
      },
      {
        id: 9,
        title: "Space Mission Launches Successfully",
        summary: "International space station receives new crew and scientific equipment.",
        image: "/placeholder.svg?height=200&width=300",
        author: "Maria Santos",
        time: "6 hours ago",
      },
    ],
  },
  trending: [
    { id: 10, title: "Climate Summit Agreement Details", views: "2.3M", category: "World" },
    { id: 11, title: "Tech Regulation Impact Analysis", views: "1.8M", category: "Technology" },
    { id: 12, title: "Olympic Highlights Compilation", views: "1.5M", category: "Sports" },
    { id: 13, title: "Infrastructure Investment Guide", views: "1.2M", category: "Politics" },
    { id: 14, title: "Market Analysis Report", views: "980K", category: "Business" },
  ],
}

// Header Component
const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.header
      className="bg-white shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [-1000, 1000] }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <span className="font-bold mr-8">BREAKING:</span>
          <span className="mr-16">Global Climate Summit Reaches Historic Agreement</span>
          <span className="font-bold mr-8">BREAKING:</span>
          <span className="mr-16">Tech Giants Face New Regulatory Challenges</span>
        </motion.div>
      </div>

      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{currentTime.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4" />
                <span>22°C</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:text-blue-600 transition-colors">E-Paper</button>
              <button className="hover:text-blue-600 transition-colors">Subscribe</button>
              <Globe className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
            <h1 className="text-3xl font-bold text-blue-900">NewsHub</h1>
            <span className="text-sm text-gray-500 ml-2">Your Trusted Source</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {["Home", "World", "Politics", "Business", "Technology", "Sports", "Entertainment"].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </motion.button>
            <motion.button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-5 h-5" />
            </motion.button>
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden bg-white border-t border-gray-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-4">
              {["Home", "World", "Politics", "Business", "Technology", "Sports", "Entertainment"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// Hero Section Component
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockNews.breaking.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockNews.breaking.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockNews.breaking.length) % mockNews.breaking.length)
  }

  return (
    <section className="relative bg-gray-900 text-white">
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={mockNews.breaking[currentSlide].image || "/placeholder.svg"}
              alt={mockNews.breaking[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <motion.div
              key={currentSlide}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-3xl"
            >
              {mockNews.breaking[currentSlide].isBreaking && (
                <span className="inline-block bg-red-600 text-white px-3 py-1 text-sm font-bold rounded mb-4">
                  BREAKING NEWS
                </span>
              )}
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {mockNews.breaking[currentSlide].title}
              </h2>
              <p className="text-lg md:text-xl mb-4 text-gray-200">{mockNews.breaking[currentSlide].summary}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-blue-600 text-white px-2 py-1 rounded">
                  {mockNews.breaking[currentSlide].category}
                </span>
                <span>By {mockNews.breaking[currentSlide].author}</span>
                <span>{mockNews.breaking[currentSlide].time}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {mockNews.breaking.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// News Card Component
const NewsCard = ({ article, size = "medium" }) => {
  const cardSizes = {
    small: "col-span-1",
    medium: "col-span-1 md:col-span-2",
    large: "col-span-1 md:col-span-3",
  }

  return (
    <motion.article
      className={`${cardSizes[size]} bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded">
            {article.category || "News"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>By {article.author}</span>
          <span>{article.time}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <motion.button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bookmark className="w-4 h-4" />
            </motion.button>
          </div>
          <span className="text-xs text-gray-400">2 min read</span>
        </div>
      </div>
    </motion.article>
  )
}

// News Categories Section
const NewsCategoriesSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Politics Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Politics</h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNews.categories.politics.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </motion.div>

        {/* Business Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Business</h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNews.categories.business.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </motion.div>

        {/* Technology Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Technology</h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNews.categories.technology.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Sidebar Component
const Sidebar = () => {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Trending Section */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="font-bold text-lg">Trending Now</h3>
        </div>
        <div className="space-y-3">
          {mockNews.trending.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
              whileHover={{ x: 5 }}
            >
              <span className="text-red-500 font-bold text-sm">{index + 1}</span>
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-2 hover:text-blue-600 transition-colors">{item.title}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{item.category}</span>
                  <span className="text-xs text-gray-400">{item.views} views</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weather Widget */}
      <motion.div
        className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-md p-6 text-white"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Weather</h3>
          <Sun className="w-6 h-6" />
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">22°C</div>
          <div className="text-sm opacity-90">Sunny</div>
          <div className="text-xs opacity-75 mt-2">New York, NY</div>
        </div>
      </motion.div>

      {/* Newsletter Signup */}
      <motion.div
        className="bg-gray-900 rounded-lg shadow-md p-6 text-white"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
        <p className="text-sm text-gray-300 mb-4">Get the latest news delivered to your inbox daily.</p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
          />
          <motion.button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Subscribe
          </motion.button>
        </div>
      </motion.div>

      {/* Social Media */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="font-bold text-lg mb-4">Follow Us</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: FaFacebookF, name: "Facebook", color: "bg-blue-600" },
            { icon: FaTwitter, name: "Twitter", color: "bg-blue-400" },
            { icon: FaInstagram, name: "Instagram", color: "bg-pink-500" },
            { icon: FaYoutube, name: "YouTube", color: "bg-red-600" },
          ].map((social) => (
            <motion.button
              key={social.name}
              className={`${social.color} text-white p-3 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <social.icon className="w-5 h-5" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </aside>
  )
}

// Multimedia Section
const MultimediaSection = () => {
  const videos = [
    {
      id: 1,
      title: "Climate Summit Highlights",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "3:45",
    },
    {
      id: 2,
      title: "Tech Innovation Showcase",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "5:20",
    },
    {
      id: 3,
      title: "Olympic Games Recap",
      thumbnail: "/placeholder.svg?height=200&width=300",
      duration: "4:15",
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Play className="w-6 h-6 text-red-500 mr-2" />
              Videos & Multimedia
            </h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="bg-white bg-opacity-90 rounded-full p-3 group-hover:bg-opacity-100 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="w-6 h-6 text-red-500" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <h3 className="font-semibold mt-3 group-hover:text-blue-600 transition-colors">{video.title}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer Component
const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">NewsHub</h3>
            <p className="text-gray-300 mb-4">
              Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of global events.
            </p>
            <div className="flex space-x-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["About Us", "Contact", "Careers", "Advertise", "Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {["World News", "Politics", "Business", "Technology", "Sports", "Entertainment"].map((category) => (
                <li key={category}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">123 News Street, NY 10001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">news@newshub.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 NewsHub. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Sitemap
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              RSS Feed
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Mobile App
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  )
}

// Main App Component
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main>
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <NewsCategoriesSection />
              <MultimediaSection />
            </div>
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
