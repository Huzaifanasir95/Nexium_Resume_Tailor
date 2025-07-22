'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface AnalysisData {
  analysis_text: string
  analysis_id: string
  user_id: string
  job_title?: string
  company?: string
  created_at: string
  [key: string]: any
}

interface ParsedAnalysis {
  summary: string
  keywordMatches: string[]
  missingKeywords: string[]
  skillsGap: string[]
  recommendations: string[]
  sections: {
    title: string
    content: string[]
  }[]
}

export default function EnhancedAnalysisDisplay() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [parsedAnalysis, setParsedAnalysis] = useState<ParsedAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useGemini, setUseGemini] = useState(false)
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
      
      // Parse the analysis text
      if (data.analysis_text) {
        if (useGemini) {
          await parseWithGemini(data.analysis_text)
        } else {
          parseAnalysisManually(data.analysis_text)
        }
      }
    } catch (err: any) {
      console.error('Error fetching analysis:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const parseAnalysisManually = (text: string) => {
    try {
      const lines = text.split('\n').filter(line => line.trim() !== '')
      
      const parsed: ParsedAnalysis = {
        summary: '',
        keywordMatches: [],
        missingKeywords: [],
        skillsGap: [],
        recommendations: [],
        sections: []
      }

      let currentSection = ''
      let currentContent: string[] = []

      // Extract summary (first paragraph)
      const summaryMatch = text.match(/^(.*?)(?=---|\n\n##|\n##)/s)
      if (summaryMatch) {
        parsed.summary = summaryMatch[1].trim()
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        
        // Section headers
        if (line.startsWith('##') || line.startsWith('#')) {
          // Save previous section
          if (currentSection && currentContent.length > 0) {
            parsed.sections.push({
              title: currentSection,
              content: [...currentContent]
            })
          }
          
          currentSection = line.replace(/#+\s*/, '').replace(/\*/g, '').trim()
          currentContent = []
          continue
        }

        // Keywords found in resume
        if (line.toLowerCase().includes('keywords from job description found') || 
            line.toLowerCase().includes('keywords found in resume')) {
          currentSection = 'Keywords Found in Resume'
          currentContent = []
          continue
        }

        // Missing keywords
        if (line.toLowerCase().includes('missing important keywords') || 
            line.toLowerCase().includes('missing keywords')) {
          currentSection = 'Missing Important Keywords'
          currentContent = []
          continue
        }

        // Skills gap
        if (line.toLowerCase().includes('skills gap') || 
            line.toLowerCase().includes('required skills missing')) {
          currentSection = 'Skills Gap Analysis'
          currentContent = []
          continue
        }

        // Recommendations
        if (line.toLowerCase().includes('recommendations') || 
            line.toLowerCase().includes('suggestions')) {
          currentSection = 'Recommendations'
          currentContent = []
          continue
        }

        // Content lines
        if (line.startsWith('*') || line.startsWith('-') || line.startsWith('•')) {
          const cleanLine = line.replace(/^[*\-•]\s*/, '').replace(/\*\*/g, '').trim()
          if (cleanLine) {
            currentContent.push(cleanLine)
            
            // Categorize content
            if (currentSection.toLowerCase().includes('keyword') && currentSection.toLowerCase().includes('found')) {
              parsed.keywordMatches.push(cleanLine)
            } else if (currentSection.toLowerCase().includes('missing')) {
              parsed.missingKeywords.push(cleanLine)
            } else if (currentSection.toLowerCase().includes('skills') || currentSection.toLowerCase().includes('gap')) {
              parsed.skillsGap.push(cleanLine)
            } else if (currentSection.toLowerCase().includes('recommend')) {
              parsed.recommendations.push(cleanLine)
            }
          }
        } else if (line && !line.startsWith('---')) {
          currentContent.push(line)
        }
      }

      // Save last section
      if (currentSection && currentContent.length > 0) {
        parsed.sections.push({
          title: currentSection,
          content: [...currentContent]
        })
      }

      setParsedAnalysis(parsed)
    } catch (err) {
      console.error('Error parsing analysis:', err)
      // Fallback to Gemini if manual parsing fails
      if (!useGemini && analysisData?.analysis_text) {
        setUseGemini(true)
        parseWithGemini(analysisData.analysis_text)
      }
    }
  }

  const parseWithGemini = async (text: string) => {
    try {
      const response = await fetch('/api/parse-analysis-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysisText: text }),
      })

      if (!response.ok) {
        throw new Error('Failed to parse with Gemini')
      }

      const parsed = await response.json()
      setParsedAnalysis(parsed)
    } catch (err) {
      console.error('Error parsing with Gemini:', err)
      // Fallback to manual parsing
      parseAnalysisManually(text)
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

  if (!analysisData || !parsedAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">No analysis data found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">📊 Resume Analysis Results</h1>
          <div className="text-gray-300 space-y-1">
            <p>Analysis ID: {analysisId}</p>
            {analysisData.job_title && <p>Position: {analysisData.job_title}</p>}
            {analysisData.company && <p>Company: {analysisData.company}</p>}
            <p>Created: {new Date(analysisData.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Summary Card */}
        {parsedAnalysis.summary && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              📝 Executive Summary
            </h2>
            <p className="text-gray-200 leading-relaxed text-lg">
              {parsedAnalysis.summary}
            </p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-500/20 backdrop-blur rounded-2xl p-6 border border-green-500/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{parsedAnalysis.keywordMatches.length}</div>
              <div className="text-green-300">Keywords Found</div>
            </div>
          </div>
          
          <div className="bg-red-500/20 backdrop-blur rounded-2xl p-6 border border-red-500/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{parsedAnalysis.missingKeywords.length}</div>
              <div className="text-red-300">Missing Keywords</div>
            </div>
          </div>
          
          <div className="bg-blue-500/20 backdrop-blur rounded-2xl p-6 border border-blue-500/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{parsedAnalysis.recommendations.length}</div>
              <div className="text-blue-300">Recommendations</div>
            </div>
          </div>
        </div>

        {/* Main Analysis Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Keywords Found */}
          {parsedAnalysis.keywordMatches.length > 0 && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                ✅ Keywords Found in Resume
              </h3>
              <div className="space-y-2">
                {parsedAnalysis.keywordMatches.map((keyword, index) => (
                  <div key={index} className="flex items-center text-gray-200">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    {keyword}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {parsedAnalysis.missingKeywords.length > 0 && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                ❌ Missing Important Keywords
              </h3>
              <div className="space-y-2">
                {parsedAnalysis.missingKeywords.map((keyword, index) => (
                  <div key={index} className="flex items-center text-gray-200">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                    {keyword}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Gap */}
          {parsedAnalysis.skillsGap.length > 0 && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                🎯 Skills Gap Analysis
              </h3>
              <div className="space-y-2">
                {parsedAnalysis.skillsGap.map((skill, index) => (
                  <div key={index} className="flex items-center text-gray-200">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {parsedAnalysis.recommendations.length > 0 && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                💡 Recommendations
              </h3>
              <div className="space-y-2">
                {parsedAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start text-gray-200">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2"></span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Sections */}
        {parsedAnalysis.sections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">📋 Detailed Analysis</h2>
            <div className="space-y-6">
              {parsedAnalysis.sections.map((section, index) => (
                <div key={index} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                  <div className="space-y-2">
                    {section.content.map((content, contentIndex) => (
                      <div key={contentIndex} className="text-gray-200 leading-relaxed">
                        {content.startsWith('*') || content.startsWith('-') ? (
                          <div className="flex items-start">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"></span>
                            <span>{content.replace(/^[*\-•]\s*/, '')}</span>
                          </div>
                        ) : (
                          <p>{content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center mt-12 space-x-4">
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300"
          >
            ← Go Back
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300"
          >
            🚀 New Analysis
          </button>
          <button 
            onClick={() => {
              setUseGemini(!useGemini)
              fetchAnalysis()
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300"
          >
            🤖 {useGemini ? 'Manual Parse' : 'AI Parse'}
          </button>
        </div>

        {/* Raw Data Toggle */}
        <details className="mt-8">
          <summary className="text-white cursor-pointer hover:text-purple-400 transition-colors">
            🔍 View Raw Analysis Data
          </summary>
          <div className="bg-black/30 rounded-lg p-4 mt-4">
            <pre className="text-gray-300 text-sm overflow-auto whitespace-pre-wrap">
              {analysisData.analysis_text}
            </pre>
          </div>
        </details>
      </div>
    </div>
  )
}
