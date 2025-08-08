const ProductsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors">
          Add New Product
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-12">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Products Overview</h2>
          <p className="text-gray-500">Select a specific product section from the sidebar to manage your products.</p>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
