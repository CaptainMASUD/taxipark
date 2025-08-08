"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import Header from "./header"
import Dashboard from "./dashboard"
import UsersPage from "./users-page"
import SalesPage from "./sales-page"
import OrdersPage from "./orders-page"
import OrderManagementPage from "./order-management-page"
import AddProductPage from "./add-product-page"
import AllProductsPage from "./all-products-page"
import ManageProductsPage from "./manage-products-page"
import NewArrivalsPage from "./new-arrivals-page"
import CustomerSupportPage from "./customer-support-page"

const AdminPanel = () => {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

   const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "add-product":
        return <AddProductPage />
      case "all-products":
        return <AllProductsPage />
      case "manage-products":
        return <ManageProductsPage />
      case "new-arrivals":
        return <NewArrivalsPage />
      case "users":
        return <UsersPage />
      case "sales":
        return <SalesPage />
      case "orders":
        return <OrdersPage />
      case "order-management":
        return <OrderManagementPage />
      case "customer-support":
        return <CustomerSupportPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen mt-20 bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">{renderPage()}</main>
      </div>
    </div>
  )
}

export default AdminPanel
