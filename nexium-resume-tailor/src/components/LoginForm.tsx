'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setMessage('')

    const { error } = await signIn(email)

    if (error) {
      setMessage(error.message)
      setIsSuccess(false)
    } else {
      setMessage('Check your email for the login link!')
      setIsSuccess(true)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 neon-glow">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Welcome to Resume Tailor
          </h2>
          <p className="text-gray-300 text-lg">
            Sign in to optimize your resume with AI
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-1 animated-gradient rounded-full"></div>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email address"
              />
            </div>

          {message && (
            <div className={`rounded-xl p-4 glass border ${
              isSuccess 
                ? 'border-emerald-500/20 bg-emerald-500/10' 
                : 'border-red-500/20 bg-red-500/10'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {isSuccess ? (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isSuccess ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-4 px-6 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Sending magic link...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send magic link
                </div>
              )}
            </button>
          </div>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              We'll send you a secure login link via email. No password required! ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
