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

interface CleanAnalysis {
  summary: string
  matchScore?: string
  keywordsFound: string[]
  missingKeywords: string[]
  skillsGap: string[]
  quickWins: string[]
  categories: {
    technical: string[]
    soft: string[]
    tools: string[]
    frameworks: string[]
  }
}

export default function CleanAnalysisDisplay() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [cleanAnalysis, setCleanAnalysis] = useState<CleanAnalysis | null>(null)
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
      
      // Always use Gemini for clean parsing
      if (data.analysis_text) {
        await parseWithGemini(data.analysis_text)
      }
    } catch (err: any) {
      console.error('Error fetching analysis:', err)
      setError(err.message)
    } finally {
      setLoading(false)
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
      setCleanAnalysis(parsed)
    } catch (err) {
      console.error('Error parsing with Gemini:', err)
      setError('Failed to process analysis')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-[#667eea] border-r-[#764ba2] mx-auto mb-6"></div>
          <div className="text-white text-xl font-semibold">Analyzing with AI...</div>
          <div className="text-gray-400 text-sm mt-2">This may take a moment</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-center glass rounded-3xl p-8">
          <div className="text-[#ef4444] text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-primary text-white px-8 py-3 rounded-2xl font-semibold"
          >
            Try New Analysis
          </button>
        </div>
      </div>
    )
  }

  if (!cleanAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white text-xl">No analysis data available</div>
      </div>
    )
  }

  const KeywordBox = ({ keyword, type }: { keyword: string, type: 'found' | 'missing' | 'skill' | 'win' | 'tech' | 'soft' | 'tool' | 'framework' }) => {
    const styles = {
      found: 'bg-[#10b981]/20 border-[#10b981]/50 text-[#10b981] hover:bg-[#10b981]/30 hover:border-[#10b981]/70',
      missing: 'bg-[#ef4444]/20 border-[#ef4444]/50 text-[#ef4444] hover:bg-[#ef4444]/30 hover:border-[#ef4444]/70',
      skill: 'bg-[#f59e0b]/20 border-[#f59e0b]/50 text-[#f59e0b] hover:bg-[#f59e0b]/30 hover:border-[#f59e0b]/70',
      win: 'bg-[#667eea]/20 border-[#667eea]/50 text-[#667eea] hover:bg-[#667eea]/30 hover:border-[#667eea]/70',
      tech: 'bg-[#764ba2]/20 border-[#764ba2]/50 text-[#764ba2] hover:bg-[#764ba2]/30 hover:border-[#764ba2]/70',
      soft: 'bg-[#f093fb]/20 border-[#f093fb]/50 text-[#f093fb] hover:bg-[#f093fb]/30 hover:border-[#f093fb]/70',
      tool: 'bg-[#06b6d4]/20 border-[#06b6d4]/50 text-[#06b6d4] hover:bg-[#06b6d4]/30 hover:border-[#06b6d4]/70',
      framework: 'bg-[#8b5cf6]/20 border-[#8b5cf6]/50 text-[#8b5cf6] hover:bg-[#8b5cf6]/30 hover:border-[#8b5cf6]/70'
    }

    return (
      <div className={`px-4 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer ${styles[type]} hover:scale-110 hover:shadow-lg`}>
        <span className="text-sm font-semibold">{keyword}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#667eea]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-10 w-96 h-96 bg-[#764ba2]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-[#f093fb]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <h1 className="text-5xl font-bold gradient-text mb-2">🎯 Resume Analysis</h1>
            <div className="h-1 w-32 bg-gradient-to-r from-[#667eea] to-[#764ba2] mx-auto rounded-full"></div>
          </div>
          <div className="glass rounded-2xl p-6 inline-block">
            <div className="flex items-center justify-center space-x-8 text-gray-300">
              <div className="flex items-center space-x-2">
                <span className="text-[#667eea]">📋</span>
                <span className="font-semibold">{analysisData?.job_title || 'Analysis'}</span>
              </div>
              {cleanAnalysis.matchScore && (
                <div className="bg-gradient-to-r from-[#10b981] to-[#667eea] text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                  {cleanAnalysis.matchScore} Match
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-[#f093fb]">📅</span>
                <span>{new Date(analysisData?.created_at || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="glass rounded-3xl p-8 mb-10 card-hover border border-white/10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center">
              <span className="mr-3 text-[#f093fb]">✨</span>
              Summary
              <span className="ml-3 text-[#667eea]">✨</span>
            </h2>
            <p className="text-gray-200 text-xl leading-relaxed max-w-4xl mx-auto">
              {cleanAnalysis.summary}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 text-center card-hover border border-[#10b981]/20">
            <div className="text-4xl font-bold text-[#10b981] mb-2">{cleanAnalysis.keywordsFound.length}</div>
            <div className="text-[#10b981] font-semibold">Keywords Found</div>
            <div className="mt-2 h-2 bg-[#10b981]/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#10b981] rounded-full animate-pulse" style={{width: '85%'}}></div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 text-center card-hover border border-[#ef4444]/20">
            <div className="text-4xl font-bold text-[#ef4444] mb-2">{cleanAnalysis.missingKeywords.length}</div>
            <div className="text-[#ef4444] font-semibold">Missing Keywords</div>
            <div className="mt-2 h-2 bg-[#ef4444]/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#ef4444] rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 text-center card-hover border border-[#f59e0b]/20">
            <div className="text-4xl font-bold text-[#f59e0b] mb-2">{cleanAnalysis.skillsGap.length}</div>
            <div className="text-[#f59e0b] font-semibold">Skills to Add</div>
            <div className="mt-2 h-2 bg-[#f59e0b]/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#f59e0b] rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 text-center card-hover border border-[#667eea]/20">
            <div className="text-4xl font-bold text-[#667eea] mb-2">{cleanAnalysis.quickWins.length}</div>
            <div className="text-[#667eea] font-semibold">Quick Wins</div>
            <div className="mt-2 h-2 bg-[#667eea]/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#667eea] rounded-full animate-pulse" style={{width: '90%'}}></div>
            </div>
          </div>
        </div>

        {/* Keywords Found */}
        {cleanAnalysis.keywordsFound.length > 0 && (
          <div className="glass rounded-3xl p-8 mb-8 card-hover border border-[#10b981]/20">
            <h3 className="text-2xl font-bold text-[#10b981] mb-6 flex items-center">
              <span className="mr-3">✅</span>
              Keywords Found in Your Resume
              <span className="ml-auto text-lg bg-[#10b981]/20 px-3 py-1 rounded-full">{cleanAnalysis.keywordsFound.length}</span>
            </h3>
            <div className="flex flex-wrap gap-4">
              {cleanAnalysis.keywordsFound.map((keyword, index) => (
                <KeywordBox key={index} keyword={keyword} type="found" />
              ))}
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {cleanAnalysis.missingKeywords.length > 0 && (
          <div className="glass rounded-3xl p-8 mb-8 card-hover border border-[#ef4444]/20">
            <h3 className="text-2xl font-bold text-[#ef4444] mb-6 flex items-center">
              <span className="mr-3">❌</span>
              Missing Keywords to Add
              <span className="ml-auto text-lg bg-[#ef4444]/20 px-3 py-1 rounded-full">{cleanAnalysis.missingKeywords.length}</span>
            </h3>
            <div className="flex flex-wrap gap-4">
              {cleanAnalysis.missingKeywords.map((keyword, index) => (
                <KeywordBox key={index} keyword={keyword} type="missing" />
              ))}
            </div>
          </div>
        )}

        {/* Skills Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Technical Skills */}
          {cleanAnalysis.categories.technical.length > 0 && (
            <div className="glass rounded-3xl p-8 card-hover border border-[#764ba2]/20">
              <h3 className="text-2xl font-bold text-[#764ba2] mb-6 flex items-center">
                <span className="mr-3">🔧</span>
                Technical Skills
                <span className="ml-auto text-lg bg-[#764ba2]/20 px-3 py-1 rounded-full">{cleanAnalysis.categories.technical.length}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {cleanAnalysis.categories.technical.map((skill, index) => (
                  <KeywordBox key={index} keyword={skill} type="tech" />
                ))}
              </div>
            </div>
          )}

          {/* Tools & Frameworks */}
          {(cleanAnalysis.categories.tools.length > 0 || cleanAnalysis.categories.frameworks.length > 0) && (
            <div className="glass rounded-3xl p-8 card-hover border border-[#06b6d4]/20">
              <h3 className="text-2xl font-bold text-[#06b6d4] mb-6 flex items-center">
                <span className="mr-3">🛠️</span>
                Tools & Frameworks
                <span className="ml-auto text-lg bg-[#06b6d4]/20 px-3 py-1 rounded-full">{cleanAnalysis.categories.tools.length + cleanAnalysis.categories.frameworks.length}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {cleanAnalysis.categories.tools.map((tool, index) => (
                  <KeywordBox key={index} keyword={tool} type="tool" />
                ))}
                {cleanAnalysis.categories.frameworks.map((framework, index) => (
                  <KeywordBox key={index} keyword={framework} type="framework" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills Gap & Quick Wins */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Skills Gap */}
          {cleanAnalysis.skillsGap.length > 0 && (
            <div className="glass rounded-3xl p-8 card-hover border border-[#f59e0b]/20">
              <h3 className="text-2xl font-bold text-[#f59e0b] mb-6 flex items-center">
                <span className="mr-3">🎯</span>
                Skills to Develop
                <span className="ml-auto text-lg bg-[#f59e0b]/20 px-3 py-1 rounded-full">{cleanAnalysis.skillsGap.length}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {cleanAnalysis.skillsGap.map((skill, index) => (
                  <KeywordBox key={index} keyword={skill} type="skill" />
                ))}
              </div>
            </div>
          )}

          {/* Quick Wins */}
          {cleanAnalysis.quickWins.length > 0 && (
            <div className="glass rounded-3xl p-8 card-hover border border-[#667eea]/20">
              <h3 className="text-2xl font-bold text-[#667eea] mb-6 flex items-center">
                <span className="mr-3">🚀</span>
                Quick Wins
                <span className="ml-auto text-lg bg-[#667eea]/20 px-3 py-1 rounded-full">{cleanAnalysis.quickWins.length}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {cleanAnalysis.quickWins.map((win, index) => (
                  <KeywordBox key={index} keyword={win} type="win" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Soft Skills */}
        {cleanAnalysis.categories.soft.length > 0 && (
          <div className="glass rounded-3xl p-8 mb-10 card-hover border border-[#f093fb]/20">
            <h3 className="text-2xl font-bold text-[#f093fb] mb-6 flex items-center">
              <span className="mr-3">💼</span>
              Soft Skills
              <span className="ml-auto text-lg bg-[#f093fb]/20 px-3 py-1 rounded-full">{cleanAnalysis.categories.soft.length}</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {cleanAnalysis.categories.soft.map((skill, index) => (
                <KeywordBox key={index} keyword={skill} type="soft" />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-x-4 mb-8">
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600/20 backdrop-blur hover:bg-gray-600/30 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 border border-gray-500/30"
          >
            ← Back
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105"
          >
            🚀 New Analysis
          </button>
          <button 
            onClick={() => fetchAnalysis()}
            className="bg-green-600/20 backdrop-blur hover:bg-green-600/30 text-green-300 px-8 py-4 rounded-2xl font-bold transition-all duration-300 border border-green-500/30"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>✨ Powered by AI • Analysis ID: {analysisId}</p>
        </div>
      </div>
    </div>
  )
}
