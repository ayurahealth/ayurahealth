import { Suspense } from 'react'
import { CheckoutContent } from './checkout-content'



function CheckoutLoading() {
  return (
    <main style={{ background: '#05100a', minHeight: '100vh', color: '#e8dfc8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading checkout...</p>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  )
}
