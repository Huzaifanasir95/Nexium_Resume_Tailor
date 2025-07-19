import React from 'react'

interface AnalysisResultsProps {
  results: {
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
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  const { overallScore, keywordAnalysis, skillsGapAnalysis, contentSuggestions, atsOptimization } = results.results

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score)
    if (numScore >= 80) return 'text-emerald-400'
    if (numScore >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBgColor = (score: string) => {
    const numScore = parseInt(score)
    if (numScore >= 80) return 'bg-emerald-500/10 border-emerald-500/20'
    if (numScore >= 60) return 'bg-yellow-500/10 border-yellow-500/20'
    return 'bg-red-500/10 border-red-500/20'
  }

  const getScoreGradient = (score: string) => {
    const numScore = parseInt(score)
    if (numScore >= 80) return 'from-emerald-500 to-teal-600'
    if (numScore >= 60) return 'from-yellow-500 to-orange-600'
    return 'from-red-500 to-pink-600'
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold gradient-text mb-4">Resume Analysis Results</h2>
        <p className="text-gray-300 text-lg">Analysis completed on {new Date(results.analysisDate).toLocaleDateString()}</p>
        <div className="mt-6 flex justify-center">
          <div className="w-24 h-1 animated-gradient rounded-full"></div>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`glass p-8 rounded-2xl border-2 ${getScoreBgColor(overallScore.matchPercentage)} card-hover`}>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Overall Match Score</h3>
          <div className={`text-8xl font-bold ${getScoreColor(overallScore.matchPercentage)} mb-8 drop-shadow-lg`}>
            {overallScore.matchPercentage}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="glass rounded-xl p-6">
              <h4 className="font-bold text-white mb-4 flex items-center">
                <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Strengths
              </h4>
              <ul className="space-y-3">
                {overallScore.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-emerald-400 mr-3 mt-1">✓</span>
                    <span className="text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h4 className="font-bold text-white mb-4 flex items-center">
                <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Improvement Areas
              </h4>
              <ul className="space-y-3">
                {overallScore.improvementAreas.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-400 mr-3 mt-1">→</span>
                    <span className="text-gray-300">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="glass p-8 rounded-2xl card-hover">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </span>
          Keyword Analysis
        </h3>
        <div className="mb-6">
          <span className="text-lg text-gray-300">Keyword Match Score: </span>
          <span className={`text-2xl font-bold ${getScoreColor(keywordAnalysis.keywordScore)}`}>
            {keywordAnalysis.keywordScore}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-white mb-4">Missing Keywords</h4>
            <div className="space-y-2">
              {keywordAnalysis.missingKeywords.map((keyword, index) => (
                <span key={index} className="inline-block bg-red-500/20 text-red-300 border border-red-500/30 text-sm px-3 py-2 rounded-lg mr-2 mb-2">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Matching Keywords</h4>
            <div className="space-y-2">
              {keywordAnalysis.matchingKeywords.map((keyword, index) => (
                <span key={index} className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm px-3 py-2 rounded-lg mr-2 mb-2">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Gap Analysis */}
      <div className="glass p-8 rounded-2xl card-hover">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
          Skills Gap Analysis
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-white mb-4">Skills to Add or Highlight</h4>
            <div className="flex flex-wrap gap-3">
              {skillsGapAnalysis.missingSkills.map((skill, index) => (
                <span key={index} className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-4 py-2 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Matching Skills</h4>
            <div className="flex flex-wrap gap-3">
              {skillsGapAnalysis.matchingSkills.map((skill, index) => (
                <span key={index} className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Recommended Skills to Emphasize</h4>
            <div className="flex flex-wrap gap-3">
              {skillsGapAnalysis.recommendedSkills.map((skill, index) => (
                <span key={index} className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Suggestions */}
      <div className="glass p-8 rounded-2xl card-hover">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </span>
          Content Suggestions
        </h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="font-semibold text-white mb-4">Improved Professional Summary</h4>
            <div className="glass p-6 rounded-xl border-l-4 border-blue-500">
              <p className="text-gray-300 italic leading-relaxed">{contentSuggestions.summaryRewrite}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Enhanced Experience Bullets</h4>
            <ul className="space-y-4">
              {contentSuggestions.experienceBullets.map((bullet, index) => (
                <li key={index} className="glass p-4 rounded-xl border-l-4 border-emerald-500">
                  <span className="text-gray-300">• {bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Achievement Highlights</h4>
            <ul className="space-y-4">
              {contentSuggestions.achievementHighlights.map((achievement, index) => (
                <li key={index} className="glass p-4 rounded-xl border-l-4 border-purple-500">
                  <span className="text-gray-300">★ {achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ATS Optimization */}
      <div className="glass p-8 rounded-2xl card-hover">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </span>
          ATS Optimization
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold text-white mb-4">Format Suggestions</h4>
            <ul className="space-y-3">
              {atsOptimization.formatSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <span className="text-teal-400 mr-3 mt-1">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Keyword Placement</h4>
            <ul className="space-y-3">
              {atsOptimization.keywordPlacement.map((placement, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <span className="text-cyan-400 mr-3 mt-1">•</span>
                  {placement}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Section Optimization</h4>
            <ul className="space-y-3">
              {atsOptimization.sectionOptimization.map((optimization, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <span className="text-indigo-400 mr-3 mt-1">•</span>
                  {optimization}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="glass p-8 rounded-2xl border border-indigo-500/30 card-hover">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          Next Steps
        </h3>
        <div className="space-y-4 text-gray-300">
          <p className="flex items-start">
            <span className="text-indigo-400 mr-3 mt-1">1.</span>
            <span><strong className="text-white">Add missing keywords</strong> naturally throughout your resume</span>
          </p>
          <p className="flex items-start">
            <span className="text-indigo-400 mr-3 mt-1">2.</span>
            <span><strong className="text-white">Highlight relevant skills</strong> that match the job requirements</span>
          </p>
          <p className="flex items-start">
            <span className="text-indigo-400 mr-3 mt-1">3.</span>
            <span><strong className="text-white">Update your professional summary</strong> with the suggested content</span>
          </p>
          <p className="flex items-start">
            <span className="text-indigo-400 mr-3 mt-1">4.</span>
            <span><strong className="text-white">Enhance experience bullets</strong> with quantifiable achievements</span>
          </p>
          <p className="flex items-start">
            <span className="text-indigo-400 mr-3 mt-1">5.</span>
            <span><strong className="text-white">Optimize formatting</strong> for ATS compatibility</span>
          </p>
          <p className="flex items-start">
            <span className="text-indigo-400 mr-3 mt-1">6.</span>
            <span><strong className="text-white">Save this analysis</strong> for future reference and tracking</span>
          </p>
        </div>
      </div>
    </div>
  )
}
