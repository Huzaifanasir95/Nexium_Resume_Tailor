import { Suspense } from 'react'
import SimpleAnalysisDisplay from '@/components/SimpleAnalysisDisplay'

export default function AnalysisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <SimpleAnalysisDisplay />
    </Suspense>
  )
}
