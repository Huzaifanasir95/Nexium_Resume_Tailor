import React from 'react'

interface SimpleAnalysisResultsProps {
  results: {
    success: boolean
    message: string
    analysisText?: string
    analysisId?: string
    userId?: string
    jobTitle?: string
    company?: string
    timestamp?: string
  }
}

export default function SimpleAnalysisResults({ results }: SimpleAnalysisResultsProps) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Simple Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Resume Analysis Results</h1>
        <p className="text-gray-300">
          Analysis completed on {results.timestamp ? new Date(results.timestamp).toLocaleDateString() : new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Analysis Text - Plain and Simple */}
      {results.analysisText && (
        <div className="bg-white text-black p-8 rounded-lg">
          <div className="whitespace-pre-wrap leading-relaxed text-sm font-mono">
            {results.analysisText}
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm">
          Analysis ID: {results.analysisId || 'N/A'}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          New Analysis
        </button>
      </div>
    </div>
  )
}
