'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SimpleAnalysisDisplay() {
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('id')

  useEffect(() => {
    if (!analysisId) {
      setError('No analysis ID provided')
      setLoading(false)
      return
    }

    fetchAnalysis()
  }, [analysisId])

  const fetchAnalysis = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/get-analysis?id=${analysisId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch analysis')
      }

      const data = await response.json()
      setAnalysisData(data)
    } catch (err: any) {
      console.error('Error fetching analysis:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analysis...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error: {error}</div>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/analysis?id=latest'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Try Latest Analysis
            </button>
            <button 
              onClick={() => window.history.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">No analysis data found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Resume Analysis Results</h1>
          <p className="text-gray-300">Analysis ID: {analysisId}</p>
        </div>

        {/* Raw Analysis Text */}
        {analysisData.analysis_text && (
          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Analysis Text</h2>
            <div className="bg-white/5 rounded p-4">
              <pre className="text-white whitespace-pre-wrap text-sm leading-relaxed">
                {analysisData.analysis_text}
              </pre>
            </div>
          </div>
        )}

        {/* All Other Data */}
        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">All Analysis Data</h2>
          <div className="bg-white/5 rounded p-4">
            <pre className="text-white text-sm overflow-auto">
              {JSON.stringify(analysisData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
