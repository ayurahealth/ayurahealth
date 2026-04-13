import { Suspense } from 'react'
import { SuccessContent } from './success-content'



function SuccessLoading() {
  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <p>Processing your payment...</p>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessContent />
    </Suspense>
  )
}
