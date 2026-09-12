'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { processPayment } from '@/actions/orders'

function MercadoPagoGateway() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [cardNumber, setCardNumber] = useState('')

  // Efecto visual de tarjeta
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId) {
      setErrorMsg('No se proporcionó un ID de orden.')
      return
    }

    setIsProcessing(true)
    setErrorMsg('')

    // Simular un retraso de procesamiento para dar realismo
    setTimeout(async () => {
      const res = await processPayment(orderId, 'MERCADO_PAGO')
      if (res.success) {
        router.push(`/pago/exito?orderId=${orderId}`)
      } else {
        setErrorMsg(res.error || 'Error procesando el pago')
        setIsProcessing(false)
      }
    }, 2000)
  }

  if (!orderId) return <div style={{ padding: '2rem', textAlign: 'center' }}>Orden inválida</div>

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      
      {/* Sandbox Banner */}
      <div style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px', color: '#d48806', fontSize: '0.85rem', maxWidth: '400px', textAlign: 'center' }}>
        <strong>Entorno de Prueba (Sandbox)</strong><br />
        Esta es una simulación de Mercado Pago. Puedes ingresar cualquier número de tarjeta ficticio.
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', overflow: 'hidden', width: '100%', maxWidth: '400px' }}>
        
        {/* Header MercadoPago */}
        <div style={{ backgroundColor: '#009ee3', padding: '1.5rem', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Mercado Pago</h2>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.9, fontSize: '0.9rem' }}>Ingresa los datos de tu tarjeta</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handlePay} style={{ padding: '2rem' }}>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.5rem' }}>Número de Tarjeta</label>
            <input 
              type="text" 
              required
              maxLength={19}
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.5rem' }}>Vencimiento</label>
              <input type="text" required placeholder="MM/AA" maxLength={5} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.5rem' }}>CVC</label>
              <input type="text" required placeholder="123" maxLength={4} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.5rem' }}>Nombre del Titular</label>
            <input type="text" required placeholder="Como aparece en la tarjeta" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
          </div>

          {errorMsg && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</div>}

          <button 
            type="submit" 
            disabled={isProcessing}
            style={{ 
              width: '100%', 
              backgroundColor: isProcessing ? '#9ca3af' : '#009ee3', 
              color: '#fff', 
              padding: '1rem', 
              borderRadius: '8px', 
              border: 'none', 
              fontSize: '1rem', 
              fontWeight: 600, 
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isProcessing ? 'Procesando Pago...' : 'Pagar Ahora'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function MercadoPagoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando pasarela...</div>}>
      <MercadoPagoGateway />
    </Suspense>
  )
}
