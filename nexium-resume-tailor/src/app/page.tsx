'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import ResumeAnalyzer from '@/components/ResumeAnalyzer'
import AnalysisResults from '@/components/AnalysisResults'
import SimpleAnalysisResults from '@/components/SimpleAnalysisResults'
import LoginForm from '@/components/LoginForm'
import UserProfile from '@/components/UserProfile'

interface AnalysisResult {
  success: boolean
  message: string
  analysisText?: string
  analysisId?: string
  userId?: string
  jobTitle?: string
  company?: string
  timestamp?: string
  data?: {
    analysisId: string
    userId: string
    analysisDate: string
    results: {
      overallScore: {
        matchPercentage: string
        improvementAreas: string[]
        strengths: string[]
      }
      keywordAnalysis: {
        missingKeywords: string[]
        matchingKeywords: string[]
        keywordScore: string
      }
      skillsGapAnalysis: {
        missingSkills: string[]
        matchingSkills: string[]
        recommendedSkills: string[]
      }
      contentSuggestions: {
        summaryRewrite: string
        experienceBullets: string[]
        achievementHighlights: string[]
      }
      atsOptimization: {
        formatSuggestions: string[]
        keywordPlacement: string[]
        sectionOptimization: string[]
      }
    }
  }
  error?: string
}

export default function Home() {
  const { user, loading } = useAuth()
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
    setShowResults(true)
  }

  const handleNewAnalysis = () => {
    setAnalysisResult(null)
    setShowResults(false)
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-300 text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Resume Tailor</h1>
              <p className="text-gray-300 mt-2">AI-powered resume optimization for job applications</p>
            </div>
            <div className="flex items-center space-x-4">
              {showResults && (
                <button
                  onClick={handleNewAnalysis}
                  className="btn-primary text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                >
                  ✨ New Analysis
                </button>
              )}
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showResults ? (
          <div>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
                Optimize Your Resume for{' '}
                <span className="gradient-text">Any Job</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Upload your resume and a job description to get AI-powered recommendations 
                that help you pass ATS systems and land more interviews.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="w-24 h-1 animated-gradient rounded-full"></div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="glass rounded-2xl p-8 text-center card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Analysis</h3>
                <p className="text-gray-300 leading-relaxed">AI analyzes your resume against job requirements to identify gaps and opportunities.</p>
              </div>

              <div className="glass rounded-2xl p-8 text-center card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">ATS Optimization</h3>
                <p className="text-gray-300 leading-relaxed">Get recommendations to ensure your resume passes Applicant Tracking Systems.</p>
              </div>

              <div className="glass rounded-2xl p-8 text-center card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Instant Results</h3>
                <p className="text-gray-300 leading-relaxed">Receive detailed feedback and improvement suggestions in seconds.</p>
              </div>
            </div>

            {/* Upload Component */}
            <ResumeAnalyzer 
              userId={user.id} 
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        ) : (
          <div>
            {analysisResult?.success ? (
              // Check if we have structured data (complex analysis) or simple text analysis
              analysisResult.data ? (
                <AnalysisResults results={analysisResult.data} />
              ) : (
                <SimpleAnalysisResults results={analysisResult} />
              )
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="glass border border-red-500/20 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Analysis Failed</h3>
                  <p className="text-gray-300 mb-6">{analysisResult?.error || 'An unexpected error occurred'}</p>
                  <button
                    onClick={handleNewAnalysis}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Resume Tailor. Powered by AI to help you land your dream job.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}