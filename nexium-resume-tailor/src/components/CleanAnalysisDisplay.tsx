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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#667eea]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#764ba2]/6 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-[#f093fb]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/2 w-64 h-64 bg-[#10b981]/6 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Enhanced Fixed Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-gradient-to-r from-[#0f0f23]/90 via-[#1a1a2e]/85 to-[#16213e]/90 border-b-2 border-gradient-to-r from-[#667eea]/30 via-[#764ba2]/30 to-[#f093fb]/30 shadow-2xl">
        <div className="w-full px-8 py-6">
          <div className="max-w-8xl mx-auto flex items-center justify-between">
            {/* Enhanced Logo/Title Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 animate-pulse">
                  <span className="text-white font-bold text-2xl">🎯</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#667eea] to-[#f093fb] rounded-2xl blur opacity-30"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black gradient-text mb-1">Resume Analysis</h1>
                <p className="text-gray-400 text-sm font-medium">AI-Powered Career Insights</p>
              </div>
            </div>

            {/* Enhanced Center Info */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-3 glass px-6 py-3 rounded-2xl border border-[#667eea]/20 hover:border-[#667eea]/40 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📋</span>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Position</p>
                  <p className="text-white font-bold text-sm">{analysisData?.job_title || 'Analysis'}</p>
                </div>
              </div>
              
              {cleanAnalysis.matchScore && (
                <div className="relative group">
                  <div className="bg-gradient-to-r from-[#10b981] via-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-2xl font-black text-lg shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/20">
                    <div className="flex items-center space-x-2">
                      <span className="animate-pulse">🔥</span>
                      <span>{cleanAnalysis.matchScore} Match</span>
                      <span className="animate-pulse">🚀</span>
                    </div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#10b981] to-[#667eea] rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                </div>
              )}
              
              <div className="flex items-center space-x-3 glass px-6 py-3 rounded-2xl border border-[#f093fb]/20 hover:border-[#f093fb]/40 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-[#f093fb] to-[#667eea] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Created</p>
                  <p className="text-white font-bold text-sm">{new Date(analysisData?.created_at || '').toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => fetchAnalysis()}
                className="group relative glass hover:bg-[#10b981]/20 text-[#10b981] p-3 rounded-2xl transition-all duration-300 hover:scale-110 border border-[#10b981]/20 hover:border-[#10b981]/40"
                title="Refresh Analysis"
              >
                <span className="text-xl group-hover:animate-spin">🔄</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="relative group bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all duration-300 shadow-xl border-2 border-white/20"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>🚀</span>
                  <span>New Analysis</span>
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#667eea] to-[#f093fb] rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              </button>
              
              <button 
                onClick={() => window.history.back()}
                className="glass hover:bg-white/10 text-gray-300 hover:text-white p-3 rounded-2xl transition-all duration-300 hover:scale-110 border border-gray-500/20 hover:border-gray-300/40"
                title="Go Back"
              >
                <span className="text-xl">←</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Animated Border */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-full h-1">
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse opacity-40"></div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto relative z-10 px-6 pt-32 pb-12">
        {/* Enhanced Main Title Section */}
        <div className="text-center mb-20">
          <div className="inline-block relative">
            <div className="relative">
              <h2 className="text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] mb-6 animate-pulse">
                Analysis Results
              </h2>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] rounded-full shadow-lg"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-[#f093fb] to-[#667eea] rounded-full animate-pulse"></div>
            </div>
            {/* Floating decorative elements */}
            <div className="absolute -top-8 -left-8 w-4 h-4 bg-[#667eea] rounded-full animate-bounce"></div>
            <div className="absolute -top-4 -right-12 w-3 h-3 bg-[#f093fb] rounded-full animate-bounce delay-300"></div>
            <div className="absolute -bottom-8 -left-12 w-5 h-5 bg-[#764ba2] rounded-full animate-bounce delay-700"></div>
            <div className="absolute -bottom-4 -right-8 w-4 h-4 bg-[#10b981] rounded-full animate-bounce delay-1000"></div>
          </div>
          <p className="text-gray-300 text-xl font-light mt-8 max-w-3xl mx-auto">
            Comprehensive AI-powered analysis of your resume with actionable insights
          </p>
        </div>

        {/* Ultra Enhanced Summary Card */}
        <div className="relative glass rounded-3xl p-12 mb-16 card-hover border-2 border-white/20 overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb]"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#667eea]/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#f093fb]/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
          
          <div className="text-center relative z-10">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-[#f093fb] via-[#764ba2] to-[#667eea] rounded-full flex items-center justify-center mr-6 shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <span className="text-4xl animate-pulse">✨</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#f093fb] to-[#667eea] rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>
              
              <h3 className="text-5xl font-black text-white group-hover:scale-105 transition-all duration-300">
                Executive Summary
              </h3>
              
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] rounded-full flex items-center justify-center ml-6 shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <span className="text-4xl animate-pulse">🎯</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#667eea] to-[#f093fb] rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <p className="text-gray-200 text-2xl lg:text-3xl leading-relaxed font-light group-hover:text-white transition-colors duration-300">
                {cleanAnalysis.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Ultra Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { count: cleanAnalysis.keywordsFound.length, label: 'Keywords Found', color: '#10b981', icon: '✅', progress: 85, bgGradient: 'from-[#10b981]/20 to-[#10b981]/5' },
            { count: cleanAnalysis.missingKeywords.length, label: 'Missing Keywords', color: '#ef4444', icon: '❌', progress: 60, bgGradient: 'from-[#ef4444]/20 to-[#ef4444]/5' },
            { count: cleanAnalysis.skillsGap.length, label: 'Skills to Add', color: '#f59e0b', icon: '🎯', progress: 70, bgGradient: 'from-[#f59e0b]/20 to-[#f59e0b]/5' },
            { count: cleanAnalysis.quickWins.length, label: 'Quick Wins', color: '#667eea', icon: '🚀', progress: 90, bgGradient: 'from-[#667eea]/20 to-[#667eea]/5' }
          ].map((stat, index) => (
            <div key={index} className={`relative glass rounded-3xl p-10 text-center card-hover border-2 border-white/20 overflow-hidden group bg-gradient-to-br ${stat.bgGradient}`}>
              <div className="absolute top-0 left-0 w-full h-2 opacity-60" style={{ backgroundColor: stat.color }}></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:scale-150 transition-all duration-700" style={{ backgroundColor: stat.color }}></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{stat.icon}</div>
                <div className="text-6xl lg:text-7xl font-black mb-4 group-hover:scale-110 transition-all duration-300" style={{ color: stat.color }}>
                  {stat.count}
                </div>
                <div className="font-bold text-white mb-6 text-xl group-hover:text-2xl transition-all duration-300">{stat.label}</div>
                
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full rounded-full transition-all duration-2000 ease-out shadow-lg"
                    style={{ 
                      backgroundColor: stat.color, 
                      width: `${stat.progress}%`,
                      boxShadow: `0 0 20px ${stat.color}40`
                    }}
                  ></div>
                </div>
                
                <div className="text-gray-300 text-sm font-medium">
                  {stat.progress}% Complete
                </div>
              </div>
            </div>
          ))}
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
