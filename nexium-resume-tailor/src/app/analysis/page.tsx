import { Suspense } from 'react'
import CleanAnalysisDisplay from '@/components/CleanAnalysisDisplay'

export default function AnalysisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading analysis...</div>
        </div>
      </div>
    }>
      <CleanAnalysisDisplay />
    </Suspense>
  )
}
