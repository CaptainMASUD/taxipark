"use client"

import { useState } from "react"
import { Mail, ArrowRight, ChevronLeft, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const ForgotPasswordPage = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
      console.log("Password reset requested for:", email)
    } catch (error) {
      console.error("Password reset request failed", error)
      setErrors({ form: "Failed to send reset email. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-50 to-transparent"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-100 rounded-full opacity-30 blur-3xl -translate-y-24 translate-x-1/4"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl translate-y-1/4 -translate-x-1/4"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-2xl font-bold mb-4 shadow-lg">
            T
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset password</h1>
          <p className="text-gray-600 mt-2">We'll send you instructions to reset your password</p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-purple-100 to-indigo-100 rounded-bl-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-t from-purple-100 to-indigo-100 rounded-tr-full opacity-50"></div>

          {/* Back Button */}
          <button
            onClick={onSwitchToLogin}
            className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 flex items-center text-sm font-medium transition-colors z-10"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to login
          </button>

          {isSubmitted ? (
            // Success State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8 relative z-10"
            >
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                If you don't see the email, check other places it might be, like your junk, spam, social, or other
                folders.
              </p>
              <button
                onClick={onSwitchToLogin}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                Back to login
              </button>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full mt-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                Resend email
              </button>
            </motion.div>
          ) : (
            // Request Form
            <div className="relative z-10 mt-6">
              {/* Form Error */}
              {errors.form && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                  <p>{errors.form}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      Reset password <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>

        {/* Security Note */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure, encrypted connection
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
