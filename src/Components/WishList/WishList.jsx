"use client"

import { useState } from "react"
import { useShopContext } from "../../Context/ShopContext"
import { Heart, ShoppingBag, ChevronLeft, ShoppingCart, Trash2, Search, SlidersHorizontal } from "lucide-react"

const Wishlist = () => {
  const { wishlist, setActiveTab, handleBackToProducts, addToCart, removeFromWishlist, isInCart } = useShopContext()

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null)
  const [itemToRemove, setItemToRemove] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [showFilters, setShowFilters] = useState(false)

  // Handle remove item with confirmation
  const confirmRemoveItem = (itemId) => {
    setItemToRemove(itemId)
    setShowRemoveConfirm(itemId)
  }

  const executeRemoveItem = () => {
    if (itemToRemove) {
      removeFromWishlist(itemToRemove)
      setShowRemoveConfirm(null)
      setItemToRemove(null)
    }
  }

  // Get product images based on category
  const getProductImage = (product) => {
    const categoryImageMap = {
      Laptops: [
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      ],
      Phones: [
        "https://images.unsplash.com/photo-1695048133142-1a20484bce71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1678911820864-e5cfd0902d68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      ],
      Accessories: [
        "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1468&q=80",
      ],
      "Smart Watches": [
        "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
      ],
      Earbuds: [
        "https://images.unsplash.com/photo-1606741965429-8d76ff50bb2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        "https://images.unsplash.com/photo-1627926539429-e8fb3a60a10f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      ],
      Tablets: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
        "https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
      ],
    }

    // Default image if category doesn't match
    const defaultImages = [
      "https://images.unsplash.com/photo-1573739122661-d7a0b93e4a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    ]

    const images = categoryImageMap[product.category] || defaultImages
    return images[Math.floor(Math.random() * images.length)]
  }

  // Filter and sort wishlist items
  const filteredWishlist = wishlist
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "rating") return b.rating - a.rating
      return 0 // default
    })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Wishlist Header */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-700 text-white py-14 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <button
                onClick={handleBackToProducts}
                className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Products
              </button>
              <h1 className="text-4xl font-bold">Your Wishlist</h1>
              <p className="text-white/80 mt-2 text-lg">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 bg-white/10 backdrop-blur-md p-1 rounded-full shadow-lg">
              <button
                className={`px-6 py-2.5 rounded-full font-medium transition-all text-white hover:bg-white/10`}
                onClick={() => setActiveTab("cart")}
              >
                <span className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Cart
                </span>
              </button>
              <button
                className={`px-6 py-2.5 rounded-full font-medium transition-all bg-white text-pink-600 shadow-md`}
              >
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-12 px-4 flex-grow">
        <div className="container mx-auto max-w-6xl">
          {/* Wishlist Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-pink-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Saved Items</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full sm:w-auto"
                />
              </div>

              {/* Filter Button */}
              <button
                className="flex items-center text-gray-600 hover:text-pink-600 transition-colors text-sm bg-white border border-gray-300 px-4 py-2 rounded-lg"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                Filter & Sort
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-4">
                <div className="font-medium text-gray-700">Sort by:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      sortBy === "default" ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSortBy("default")}
                  >
                    Default
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      sortBy === "price-low"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSortBy("price-low")}
                  >
                    Price: Low to High
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      sortBy === "price-high"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSortBy("price-high")}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      sortBy === "name" ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSortBy("name")}
                  >
                    Name
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      sortBy === "rating" ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSortBy("rating")}
                  >
                    Highest Rated
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Items */}
          {filteredWishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all group"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={getProductImage(item) || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Price Tag */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-3 py-1 rounded-full shadow-sm">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Stock Badge */}
                    {item.inStock ? (
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                        In Stock
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700 ml-1">{item.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.description}</p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {item.specs.slice(0, 3).map((spec, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className={`flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center ${
                          isInCart(item.id)
                            ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                        }`}
                        onClick={() => addToCart(item.id)}
                        disabled={isInCart(item.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1.5" />
                        {isInCart(item.id) ? "In Cart" : "Add to Cart"}
                      </button>

                      <button
                        className="p-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors relative"
                        onClick={() => confirmRemoveItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />

                        {/* Remove confirmation */}
                        {showRemoveConfirm === item.id && (
                          <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10 animate-fadeIn">
                            <p className="text-sm text-gray-600 mb-2">Remove from wishlist?</p>
                            <div className="flex justify-end space-x-2">
                              <button
                                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowRemoveConfirm(null)
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  executeRemoveItem()
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't saved any products yet. Browse our collection and add items to your wishlist.
              </p>
              <button
                onClick={handleBackToProducts}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-colors"
              >
                Discover Products
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Wishlist
