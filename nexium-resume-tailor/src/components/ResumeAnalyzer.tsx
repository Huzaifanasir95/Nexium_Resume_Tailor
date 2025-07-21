import React, { useState } from 'react'

interface AnalysisResult {
  success: boolean
  message: string
  data?: any
  error?: string
  analysisText?: string
  analysisId?: string
  userId?: string
  jobTitle?: string
  company?: string
  timestamp?: string
}

interface ResumeAnalyzerProps {
  userId: string
  onAnalysisComplete: (result: AnalysisResult) => void
}

export default function ResumeAnalyzer({ userId, onAnalysisComplete }: ResumeAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Please select a PDF or DOCX file')
      return
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (selectedFile.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }

    setFile(selectedFile)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(false)
    
    const selectedFile = event.dataTransfer.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(false)
  }

  const analyzeResume = async (file: File): Promise<AnalysisResult> => {
    // Create FormData to send file directly
    const formData = new FormData()
    
    // Add the PDF file directly
    formData.append('resumeFile', file)
    
    // Add other form fields
    formData.append('userId', userId)
    formData.append('jobTitle', jobTitle || 'Not specified')
    formData.append('company', company || 'Not specified')
    formData.append('jobDescription', jobDescription)

    console.log('Starting analysis - this may take a few minutes...')

    // Send to n8n webhook and wait for the complete workflow to finish
    const response = await fetch('/api/resume-analysis', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorResult = await response.json()
      throw new Error(errorResult.error || 'Analysis failed')
    }

    const result = await response.json()
    
    console.log('Analysis completed:', result)
    console.log('Raw result type:', typeof result)
    console.log('Raw result keys:', Object.keys(result || {}))
    
    // Extract analysis ID from the complex nested structure
    let analysisId = 'unknown'
    
    // First try direct properties
    if (result && result.analysisId) {
      analysisId = result.analysisId
    } else if (result && result.analysis_id) {
      analysisId = result.analysis_id
    } else if (Array.isArray(result) && result.length > 0 && result[0].analysis_id) {
      analysisId = result[0].analysis_id
    } else {
      // Handle the nested object structure from n8n
      const resultString = JSON.stringify(result)
      console.log('Searching for analysisId in:', resultString)
      
      // Look for analysisId pattern in the stringified result
      const analysisIdMatch = resultString.match(/"analysisId":\s*"([^"]+)"/);
      if (analysisIdMatch && analysisIdMatch[1]) {
        analysisId = analysisIdMatch[1]
        console.log('Found analysisId via regex:', analysisId)
      } else {
        // Try to navigate the nested structure
        try {
          const keys = Object.keys(result)
          for (const key of keys) {
            if (typeof result[key] === 'object' && result[key] !== null) {
              if (result[key].analysisId) {
                analysisId = result[key].analysisId
                console.log('Found analysisId in nested object:', analysisId)
                break
              }
              // Check if it's a string that contains JSON
              if (typeof key === 'string' && key.includes('analysisId')) {
                const idMatch = key.match(/"analysisId":\s*"([^"]+)"/);
                if (idMatch && idMatch[1]) {
                  analysisId = idMatch[1]
                  console.log('Found analysisId in key:', analysisId)
                  break
                }
              }
            }
          }
        } catch (e) {
          console.error('Error parsing nested result:', e)
        }
      }
    }
    
    console.log('Final extracted analysisId:', analysisId)

    return {
      success: true,
      message: 'Resume analysis completed successfully',
      analysisId: analysisId,
      userId: userId,
      jobTitle: jobTitle,
      company: company,
      timestamp: new Date().toISOString()
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!file) {
      alert('Please select a resume file')
      return
    }

    if (!jobDescription.trim()) {
      alert('Please enter a job description')
      return
    }

    try {
      setIsAnalyzing(true)
      const result = await analyzeResume(file)
      
      console.log('📋 Received analysis result:', result)
      
      if (result.success && result.analysisId) {
        // Redirect to the new simple analysis page
        window.location.href = `/analysis?id=${result.analysisId}`
      } else {
        console.error('❌ No analysis ID returned')
        onAnalysisComplete({
          success: false,
          message: 'Analysis failed - no analysis ID returned',
          error: 'No analysis ID found'
        })
      }
      
    } catch (error: any) {
      console.error('Resume analysis error:', error)
      onAnalysisComplete({
        success: false,
        message: 'Analysis failed',
        error: error.message || 'An unexpected error occurred'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto glass rounded-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Upload Section */}
        <div>
          <label className="block text-xl font-bold text-white mb-6">
            📄 Upload Your Resume
          </label>
          
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-indigo-400 bg-indigo-500/10 neon-glow' 
                : file 
                ? 'border-emerald-400 bg-emerald-500/10' 
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isAnalyzing}
            />
            
            {!file ? (
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-xl text-white mb-3 font-semibold">
                  Drag and drop your resume here, or click to browse
                </p>
                <p className="text-gray-400">
                  Supports PDF and DOCX files up to 10MB
                </p>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl text-emerald-400 font-semibold mb-2">
                  {file.name}
                </p>
                <p className="text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Job Description Section */}
        <div>
          <label className="block text-xl font-bold text-white mb-6">
            💼 Job Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
            rows={12}
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none"
            disabled={isAnalyzing}
            required
          />
          <p className="text-gray-400 mt-3">
            Include the full job posting for best results
          </p>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Job Title (Optional)
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Software Engineer"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              disabled={isAnalyzing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Company (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Tech Corp"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              disabled={isAnalyzing}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={!file || !jobDescription.trim() || isAnalyzing}
            className="btn-primary text-white px-12 py-4 rounded-2xl text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          >
            {isAnalyzing ? (
              <div className="flex items-center">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-4"></div>
                🔍 Analyzing Resume...
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-3">✨</span>
                Analyze Resume
                <span className="ml-3">🚀</span>
              </div>
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Keyword match analysis with missing keywords identified
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Skills gap analysis and recommendations
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Content suggestions for better impact
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              ATS optimization recommendations
            </li>
          </ul>
        </div>
      </form>
    </div>
  )
}
