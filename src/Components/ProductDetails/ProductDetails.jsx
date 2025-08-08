import React, { useState, useEffect } from 'react';
import { useShopContext } from '../../Context/ShopContext';
import { ArrowLeft, Heart, ShoppingCart, Star, ChevronRight, Truck, Shield, RotateCcw, Share2, ChevronDown, ChevronUp, Check } from 'lucide-react';

const ProductDetails = () => {
  const { 
    selectedProduct, 
    handleBackToProducts, 
    addToCart, 
    addToWishlist, 
    removeFromWishlist,
    isInWishlist
  } = useShopContext();
  
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSpecs, setExpandedSpecs] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!selectedProduct) return null;

  // Get product images based on category
  const getProductImages = () => {
    const categoryImageMap = {
      'Laptops': [
        'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
      ],
      'Phones': [
        'https://images.unsplash.com/photo-1695048133142-1a20484bce71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1678911820864-e5cfd0902d68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1527&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80'
      ],
      'Accessories': [
        'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1468&q=80',
        'https://images.unsplash.com/photo-1659921857480-af9c7a4a4c1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1622445275576-721325763afe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
      ],
      'Smart Watches': [
        'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1527&q=80',
        'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      ],
      'Earbuds': [
        'https://images.unsplash.com/photo-1606741965429-8d76ff50bb2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
        'https://images.unsplash.com/photo-1627926539429-e8fb3a60a10f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      ],
      'Tablets': [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
        'https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      ]
    };

    // Default images if category doesn't match
    const defaultImages = [
      'https://images.unsplash.com/photo-1573739122661-d7a0b93e4a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ];

    return categoryImageMap[selectedProduct.category] || defaultImages;
  };

  const productImages = getProductImages();

  // Render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="text-yellow-400 fill-yellow-400 h-4 w-4" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        // For half star, we'll use a custom style
        stars.push(
          <div key={i} className="relative">
            <Star className="text-gray-300 fill-gray-300 h-4 w-4" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="text-yellow-400 fill-yellow-400 h-4 w-4" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="text-gray-300 h-4 w-4" />);
      }
    }
    
    return stars;
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct.id);
    setShowToast(true);
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(selectedProduct.id)) {
      removeFromWishlist(selectedProduct.id);
    } else {
      addToWishlist(selectedProduct.id);
    }
  };

  // Calculate discount percentage
  const originalPrice = selectedProduct.price * 1.2; // Assuming 20% discount for demo
  const discountPercentage = Math.round(((originalPrice - selectedProduct.price) / originalPrice) * 100);

  // Get related products based on category
  const getRelatedProductImages = () => {
    const relatedImages = {
      'Laptops': [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1468&q=80',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
        'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      ],
      'Phones': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1529&q=80',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1530&q=80',
        'https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80'
      ]
    };
    
    return relatedImages[selectedProduct.category] || [
      'https://images.unsplash.com/photo-1573739122661-d7a0b93e4a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ];
  };

  const relatedProductImages = getRelatedProductImages();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        showToast ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
      }`}>
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center border-l-4 border-green-500">
          <div className="bg-green-100 rounded-full p-1 mr-3">
            <Check className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Added to cart!</p>
            <p className="text-sm text-gray-500">{selectedProduct.name} has been added to your cart</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <button 
              onClick={handleBackToProducts}
              className="flex items-center hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-300" />
            <span className="text-gray-500">Products</span>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-300" />
            <span className="text-gray-500">{selectedProduct.category}</span>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-300" />
            <span className="font-medium text-gray-900 truncate max-w-[200px]">{selectedProduct.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="p-6 lg:p-8">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={productImages[selectedImage] || "/placeholder.svg"} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Discount badge */}
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {discountPercentage}% OFF
                  </div>
                  
                  {/* Wishlist button */}
                  <button 
                    onClick={handleToggleWishlist}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Heart 
                      className={`h-5 w-5 ${isInWishlist(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                    />
                  </button>
                </div>
                
                {/* Thumbnail gallery */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-purple-500' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={img || "/placeholder.svg"} 
                        alt={`${selectedProduct.name} view ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-6 lg:p-8 flex flex-col">
                <div className="mb-2">
                  <span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-md">
                    {selectedProduct.category}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {renderRating(selectedProduct.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {selectedProduct.rating} ({Math.floor(Math.random() * 500) + 50} reviews)
                  </span>
                </div>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-gray-900">${selectedProduct.price.toFixed(2)}</span>
                  <span className="text-lg text-gray-500 line-through ml-2">${originalPrice.toFixed(2)}</span>
                  <span className="ml-2 text-sm font-medium text-green-600">Save ${(originalPrice - selectedProduct.price).toFixed(2)}</span>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                
                {/* Availability */}
                <div className="flex items-center mb-6">
                  <div className={`h-3 w-3 rounded-full mr-2 ${selectedProduct.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm font-medium ${selectedProduct.inStock ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {selectedProduct.inStock && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Only {Math.floor(Math.random() * 20) + 1} left)
                    </span>
                  )}
                </div>
                
                {/* Color options (mock) */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                  <div className="flex space-x-2">
                    {['bg-black', 'bg-gray-400', 'bg-white border border-gray-300', 'bg-blue-600'].map((color, i) => (
                      <button 
                        key={i} 
                        className={`w-8 h-8 rounded-full ${color} ${i === 0 ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                        aria-label={`Color option ${i+1}`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
                    onClick={handleAddToCart}
                    disabled={!selectedProduct.inStock}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                  
                  <button 
                    onClick={handleToggleWishlist}
                    className={`p-3 rounded-lg border flex items-center justify-center transition-colors ${
                      isInWishlist(selectedProduct.id) 
                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
                
                {/* Shipping & Returns */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex">
                    <Truck className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Free Shipping</h3>
                      <p className="text-sm text-gray-500">Delivery in 2-5 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <RotateCcw className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Easy Returns</h3>
                      <p className="text-sm text-gray-500">30-day return policy</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Warranty</h3>
                      <p className="text-sm text-gray-500">1-year limited warranty</p>
                    </div>
                  </div>
                </div>
                
                {/* Share */}
                <div className="mt-6 flex items-center">
                  <button className="text-gray-500 hover:text-gray-700 flex items-center text-sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tabs Section */}
            <div className="border-t border-gray-200">
              <div className="flex border-b border-gray-200">
                <button 
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'description' 
                      ? 'text-purple-600 border-b-2 border-purple-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'specifications' 
                      ? 'text-purple-600 border-b-2 border-purple-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('specifications')}
                >
                  Specifications
                </button>
                <button 
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'reviews' 
                      ? 'text-purple-600 border-b-2 border-purple-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
              
              <div className="p-6 lg:p-8">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-600">
                      {selectedProduct.description}
                    </p>
                    <p className="text-gray-600 mt-4">
                      Experience the future of technology with the {selectedProduct.name}. This cutting-edge device combines 
                      sleek design with powerful performance, making it the perfect addition to your tech collection.
                    </p>
                    <p className="text-gray-600 mt-4">
                      Whether you're a professional looking for reliable tools or a tech enthusiast seeking the latest innovations,
                      the {selectedProduct.name} delivers exceptional value with its advanced features and premium build quality.
                    </p>
                  </div>
                )}
                
                {activeTab === 'specifications' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-4">Technical Specifications</h3>
                        <div className="space-y-3">
                          {selectedProduct.specs.slice(0, expandedSpecs ? undefined : 5).map((spec, index) => (
                            <div key={index} className="flex">
                              <div className="w-3 h-3 rounded-full bg-purple-200 mt-1.5 mr-3 flex-shrink-0"></div>
                              <p className="text-gray-600">{spec}</p>
                            </div>
                          ))}
                        </div>
                        
                        {selectedProduct.specs.length > 5 && (
                          <button 
                            className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                            onClick={() => setExpandedSpecs(!expandedSpecs)}
                          >
                            {expandedSpecs ? (
                              <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
                            ) : (
                              <>Show More <ChevronDown className="h-4 w-4 ml-1" /></>
                            )}
                          </button>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-4">In The Box</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>1 x {selectedProduct.name}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>User Manual</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Power Adapter</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Warranty Card</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="text-center py-8">
                    <div className="text-6xl font-bold text-yellow-400 mb-2">{selectedProduct.rating}</div>
                    <div className="flex justify-center mb-4">
                      {renderRating(selectedProduct.rating)}
                    </div>
                    <p className="text-gray-500 mb-6">Based on {Math.floor(Math.random() * 500) + 50} reviews</p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Write a Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProductImages.map((image, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  <img 
                    src={image || "/placeholder.svg"}
                    alt={`Related product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">Related Product {index + 1}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">4.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">${(Math.random() * 500 + 99).toFixed(2)}</span>
                    <button 
                      className="text-purple-600 hover:text-purple-800"
                      onClick={handleAddToCart} // Using same function for demo
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;