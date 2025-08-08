import React, { createContext, useState, useContext } from 'react';

// Create the context
const ShopContext = createContext();

// Sample product data with detailed specifications
const productData = [
  { 
    id: 1, 
    name: 'Dell XPS 13', 
    price: 999.99, 
    category: 'Laptops',
    description: 'Ultra-slim, high-performance laptop with 13.4-inch Infinity Edge display.',
    specs: [
      'Intel i7 11th Gen',
      '16GB RAM',
      '512GB SSD',
      'Touchscreen'
    ],
    rating: 4.7,
    inStock: true
  },
  { 
    id: 2, 
    name: 'Dell XPS 15', 
    price: 1299.99, 
    category: 'Laptops',
    description: 'Powerful laptop with stunning 15.6-inch display and premium build quality.',
    specs: [
      'Intel i9 12th Gen',
      '32GB RAM',
      '1TB SSD',
      'NVIDIA RTX 3050 Ti'
    ],
    rating: 4.8,
    inStock: true
  },
  { 
    id: 3, 
    name: 'Dell XPS 17', 
    price: 1599.99, 
    category: 'Laptops',
    description: 'Desktop-class performance in a sleek 17-inch laptop for professionals.',
    specs: [
      'Intel i9 12th Gen',
      '64GB RAM',
      '2TB SSD',
      'NVIDIA RTX 3060'
    ],
    rating: 4.9,
    inStock: false
  },
  { 
    id: 4, 
    name: 'iPhone 15', 
    price: 899.99, 
    category: 'Phones',
    description: 'Latest iPhone with advanced camera system and all-day battery life.',
    specs: [
      'A16 Bionic Chip',
      '128GB Storage',
      'Super Retina XDR',
      'Ceramic Shield'
    ],
    rating: 4.6,
    inStock: true
  },
  { 
    id: 5, 
    name: 'Samsung Galaxy S23 Ultra', 
    price: 999.99, 
    category: 'Phones',
    description: 'Ultra-slim, high-performance smartphone with advanced camera system.',
    specs: [
      'Snapdragon 8 Gen 2',
      '12GB RAM',
      '512GB Storage',
      '200MP Camera'
    ],
    rating: 4.8,
    inStock: true
  },
  // More products...
  { id: 6, name: 'Google Pixel 8', price: 749.99, category: 'Phones', description: 'Pure Android experience with exceptional camera quality.', specs: ['Google Tensor G3', '8GB RAM', '256GB Storage', 'Night Sight Camera'], rating: 4.5, inStock: true },
  { id: 7, name: 'AirPods Pro', price: 249.99, category: 'Earbuds', description: 'Premium wireless earbuds with active noise cancellation.', specs: ['Active Noise Cancellation', 'Transparency Mode', 'Spatial Audio', 'Water Resistant'], rating: 4.7, inStock: true },
  { id: 8, name: 'Samsung Galaxy Buds', price: 149.99, category: 'Earbuds', description: 'Wireless earbuds with amazing sound quality and comfort.', specs: ['Dynamic Drivers', 'Active Noise Cancellation', '8 Hour Battery', 'Wireless Charging'], rating: 4.4, inStock: true },
  { id: 9, name: 'Apple Watch Series 9', price: 399.99, category: 'Smart Watches', description: 'Advanced health monitoring and connectivity on your wrist.', specs: ['Always-On Retina', 'ECG App', 'Blood Oxygen', 'Water Resistant'], rating: 4.8, inStock: true },
  { id: 10, name: 'Samsung Galaxy Watch', price: 299.99, category: 'Smart Watches', description: 'Track your fitness and stay connected with this premium smartwatch.', specs: ['AMOLED Display', 'BioActive Sensor', '40 Hour Battery', 'Advanced Sleep Coaching'], rating: 4.6, inStock: true },
  { id: 11, name: 'iPad Pro', price: 799.99, category: 'Tablets', description: 'Professional-grade tablet with M2 chip for incredible performance.', specs: ['M2 Chip', '11-inch Liquid Retina', '256GB Storage', 'Face ID'], rating: 4.9, inStock: true },
  { id: 12, name: 'Samsung Galaxy Tab', price: 649.99, category: 'Tablets', description: 'Premium Android tablet with S Pen support and vibrant display.', specs: ['Snapdragon 8 Gen 1', '12.4-inch AMOLED', '8GB RAM', 'S Pen Included'], rating: 4.7, inStock: true },
  { id: 13, name: 'Laptop Sleeve', price: 29.99, category: 'Accessories', description: 'Protective sleeve for laptops with water-resistant material.', specs: ['Water Resistant', 'Shock Absorbing', 'Multiple Pockets', 'Fits up to 15.6"'], rating: 4.5, inStock: true },
  { id: 14, name: 'USB-C Hub', price: 49.99, category: 'Accessories', description: 'Expand your connectivity with multiple ports and fast data transfer.', specs: ['4K HDMI', 'USB 3.0 Ports', 'SD Card Reader', 'Power Delivery'], rating: 4.4, inStock: true },
  { id: 15, name: 'Wireless Charger', price: 39.99, category: 'Accessories', description: 'Fast wireless charging for compatible devices.', specs: ['15W Fast Charging', 'Qi Compatible', 'LED Indicator', 'Anti-Slip Surface'], rating: 4.3, inStock: true },
];

// Provider component
export const ShopProvider = ({ children }) => {
  const [products] = useState(productData);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [activeTab, setActiveTab] = useState('cart'); // 'cart' or 'wishlist'
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([
    productData[0], // Add some default items to wishlist for demo
    productData[1],
    productData[2]
  ]);

  // Calculate total cost of items in cart
  const cartTotal = cart.reduce((total, item) => total + item.price, 0).toFixed(2);

  // Filter products based on the active category
  const filteredProducts = activeCategory === 'All Products' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Handle category selection
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setShowProductDetails(false);
    setShowDashboard(false);
    setShowStatistics(false);
  };

  // Handle product selection
  const handleProductClick = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setShowProductDetails(true);
    setShowDashboard(false);
    setShowStatistics(false);
  };

  // Go back to product list
  const handleBackToProducts = () => {
    setShowProductDetails(false);
    setShowDashboard(false);
    setShowStatistics(false);
  };

  // Show dashboard
  const handleShowDashboard = (tab = 'cart') => {
    setActiveTab(tab);
    setShowDashboard(true);
    setShowProductDetails(false);
    setShowStatistics(false);
  };

  // Show statistics
  const handleShowStatistics = () => {
    setShowStatistics(true);
    setShowDashboard(false);
    setShowProductDetails(false);
  };

  // Add to cart
  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setCart(prevCart => [...prevCart, product]);
      // Remove from wishlist if it's there
      setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
    }
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    // Find the index of the first occurrence of the product
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1); // Remove only one occurrence
      setCart(newCart);
    }
  };

  // Add to wishlist
  const addToWishlist = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product && !wishlist.some(item => item.id === productId)) {
      setWishlist(prevWishlist => [...prevWishlist, product]);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Sort cart by price
  const sortCartByPrice = () => {
    setCart([...cart].sort((a, b) => a.price - b.price));
  };

  // Complete purchase
  const completePurchase = () => {
    // Here you would typically send the order to a backend API
    // For now, we'll just clear the cart
    setCart([]);
  };

  return (
    <ShopContext.Provider 
      value={{ 
        products, 
        filteredProducts, 
        activeCategory,
        selectedProduct,
        showProductDetails,
        showDashboard,
        showStatistics,
        activeTab,
        cart,
        wishlist,
        cartTotal,
        handleCategoryClick, 
        handleProductClick,
        handleBackToProducts,
        handleShowDashboard,
        handleShowStatistics,
        setActiveTab,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        isInCart,
        isInWishlist,
        sortCartByPrice,
        completePurchase
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook to use the context
export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
};