"use client"

import { useState, useEffect } from "react"
import {
  X,
  CheckCircle,
  Package,
  Truck,
  Calendar,
  ChevronRight,
  Download,
  Share2,
  CreditCard,
  ShieldCheck,
} from "lucide-react"

const PurchaseModal = ({ isOpen, onClose, total }) => {
  const [orderNumber, setOrderNumber] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Generate random order number
      setOrderNumber(
        `ORD-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
      )

      // Set estimated delivery date (7-10 days from now)
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + 7 + Math.floor(Math.random() * 3))
      setEstimatedDelivery(
        deliveryDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      )

      // Trigger animation
      setTimeout(() => setAnimateIn(true), 50)

      // Add body class to prevent scrolling
      document.body.classList.add("overflow-hidden")
    } else {
      setAnimateIn(false)
      // Remove body class when modal closes
      document.body.classList.remove("overflow-hidden")
    }

    // Cleanup function
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all duration-300 flex flex-col md:flex-row ${
          animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Left Side - Order Confirmation */}
        <div className="md:w-5/12 bg-gradient-to-br from-purple-700 to-indigo-800 p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center justify-center flex-col h-full">
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-center mb-3">Order Confirmed!</h2>
            <p className="text-white/80 text-center mb-6">Thank you for your purchase</p>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 w-full mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/80">Order Number</span>
                <span className="text-white font-bold">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/80">Total Amount</span>
                <span className="text-white font-bold">${Number.parseFloat(total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Payment Method</span>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="text-white font-bold">Credit Card</span>
                </div>
              </div>
            </div>

            <div className="mt-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-white/80" />
                <span className="text-white/80 text-sm">Secure Transaction</span>
              </div>
              <p className="text-white/60 text-xs">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>

        {/* Right Side - Order Details */}
        <div className="md:w-7/12 p-8 max-h-[80vh] overflow-y-auto">
          <h3 className="text-gray-900 font-bold text-xl mb-6">Order Status</h3>

          {/* Order Timeline */}
          <div className="relative mb-8">
            {/* Timeline Line */}
            <div className="absolute left-3.5 top-0 h-full w-0.5 bg-gray-200"></div>

            {/* Order Placed */}
            <div className="flex items-start mb-6 relative z-10">
              <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4">
                <h4 className="text-gray-900 font-medium">Order Placed</h4>
                <p className="text-gray-500 text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Processing */}
            <div className="flex items-start mb-6 relative z-10">
              <div className="h-7 w-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4">
                <h4 className="text-gray-900 font-medium">Processing</h4>
                <p className="text-gray-500 text-sm">Your order is being processed</p>
              </div>
            </div>

            {/* Shipping */}
            <div className="flex items-start mb-6 relative z-10">
              <div className="h-7 w-7 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4 text-gray-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-gray-500 font-medium">Shipping</h4>
                <p className="text-gray-500 text-sm">Your order will be shipped soon</p>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-start relative z-10">
              <div className="h-7 w-7 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4 text-gray-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-gray-500 font-medium">Estimated Delivery</h4>
                <p className="text-gray-500 text-sm">{estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Shipping Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Shipping Method</p>
                <p className="font-medium">Express Delivery</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                <p className="font-medium">TRK-{Math.floor(Math.random() * 1000000)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center justify-center"
            >
              Continue Shopping
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>

            <div className="flex space-x-3">
              <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                <Download className="h-4 w-4 mr-1.5" />
                Receipt
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                <Share2 className="h-4 w-4 mr-1.5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseModal
