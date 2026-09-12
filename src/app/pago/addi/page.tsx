'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { processPayment } from '@/actions/orders'

function AddiGateway() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [installments, setInstallments] = useState(3)

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId) {
      setErrorMsg('No se proporcionó un ID de orden.')
      return
    }

    setIsProcessing(true)
    setErrorMsg('')

    // Simular procesamiento de crédito ADDI
    setTimeout(async () => {
      const res = await processPayment(orderId, 'ADDI')
      if (res.success) {
        router.push(`/pago/exito?orderId=${orderId}`)
      } else {
        setErrorMsg(res.error || 'Error procesando el crédito')
        setIsProcessing(false)
      }
    }, 2500)
  }

  if (!orderId) return <div style={{ padding: '2rem', textAlign: 'center' }}>Orden inválida</div>

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      
      {/* Sandbox Banner */}
      <div style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px', color: '#d48806', fontSize: '0.85rem', maxWidth: '400px', textAlign: 'center' }}>
        <strong>Entorno de Prueba (Sandbox)</strong><br />
        Esta es una simulación de crédito ADDI. La aprobación es automática.
      </div>

      <div style={{ backgroundColor: '#fff', border: '2px solid #000', borderRadius: '16px', overflow: 'hidden', width: '100%', maxWidth: '400px', boxShadow: '8px 8px 0px rgba(0,210,255,0.3)' }}>
        
        {/* Header ADDI */}
        <div style={{ backgroundColor: '#00d2ff', padding: '2rem', textAlign: 'center', color: '#000', borderBottom: '2px solid #000' }}>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>ADDI</h2>
          <p style={{ margin: '0.5rem 0 0', fontWeight: 500, fontSize: '0.9rem' }}>Compra ahora, paga después.</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handlePay} style={{ padding: '2rem' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#000', marginBottom: '1rem', fontWeight: 600 }}>¿En cuántas cuotas quieres pagar?</label>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              {[1, 2, 3].map(num => (
                <div 
                  key={num}
                  onClick={() => setInstallments(num)}
                  style={{ 
                    border: installments === num ? '2px solid #000' : '2px solid #e5e5e5',
                    backgroundColor: installments === num ? '#00d2ff' : '#fff',
                    borderRadius: '8px',
                    padding: '1rem 0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 700,
                    transition: 'all 0.2s'
                  }}
                >
                  {num} {num === 1 ? 'cuota' : 'cuotas'}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.75rem', textAlign: 'center' }}>0% de interés respaldado por ADDI.</p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.5rem' }}>Cédula de Ciudadanía</label>
            <input type="text" required placeholder="Ingresa tu número de documento" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e5e5', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
          </div>

          {errorMsg && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>{errorMsg}</div>}

          <button 
            type="submit" 
            disabled={isProcessing}
            style={{ 
              width: '100%', 
              backgroundColor: isProcessing ? '#e5e5e5' : '#000', 
              color: isProcessing ? '#9ca3af' : '#fff', 
              padding: '1rem', 
              borderRadius: '8px', 
              border: 'none', 
              fontSize: '1rem', 
              fontWeight: 700, 
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isProcessing ? 'Validando Crédito...' : 'Aprobar Crédito'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AddiPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando pasarela...</div>}>
      <AddiGateway />
    </Suspense>
  )
}
