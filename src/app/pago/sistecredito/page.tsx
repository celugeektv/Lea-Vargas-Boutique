'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { processPayment } from '@/actions/orders'

function SistecreditoGateway() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [installments, setInstallments] = useState(2)
  const [cedula, setCedula] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: Cedula, 2: OTP

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (cedula.length > 5) {
      setStep(2)
    } else {
      setErrorMsg('Ingresa una cédula válida')
    }
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId) {
      setErrorMsg('No se proporcionó un ID de orden.')
      return
    }
    
    if (otp.length < 4) {
      setErrorMsg('Ingresa el código OTP enviado a tu celular.')
      return
    }

    setIsProcessing(true)
    setErrorMsg('')

    // Simular procesamiento de crédito Sistecrédito
    setTimeout(async () => {
      const res = await processPayment(orderId, 'Sistecrédito')
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
        Esta es una simulación de pago con Sistecrédito. Ingresa cualquier cédula y OTP.
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px', overflow: 'hidden', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        {/* Header Sistecrédito */}
        <div style={{ backgroundColor: '#00b050', padding: '2rem', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>sistecrédito</h2>
          <p style={{ margin: '0.5rem 0 0', fontWeight: 500, fontSize: '0.9rem' }}>Lo hacemos posible.</p>
        </div>

        {/* Formulario */}
        <div style={{ padding: '2rem' }}>
          {step === 1 ? (
            <form onSubmit={handleNextStep}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#000', marginBottom: '1rem', fontWeight: 600 }}>Plazo (Quincenas)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[2, 4, 6, 8].map(num => (
                    <div 
                      key={num}
                      onClick={() => setInstallments(num)}
                      style={{ 
                        border: installments === num ? '2px solid #00b050' : '1px solid #e5e5e5',
                        backgroundColor: installments === num ? '#e6f7ed' : '#fff',
                        borderRadius: '8px',
                        padding: '1rem 0',
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontWeight: 600,
                        color: installments === num ? '#00b050' : '#4b5563',
                        transition: 'all 0.2s'
                      }}
                    >
                      {num} {num === 1 ? 'quincena' : 'quincenas'}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.5rem' }}>Número de Cédula</label>
                <input 
                  type="text" 
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  required 
                  placeholder="Ej: 1020304050" 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} 
                />
              </div>

              {errorMsg && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>{errorMsg}</div>}

              <button 
                type="submit" 
                style={{ width: '100%', backgroundColor: '#00b050', color: '#fff', padding: '1rem', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
              >
                Continuar
              </button>
            </form>
          ) : (
            <form onSubmit={handlePay}>
              <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#000' }}>Código de Verificación</h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                  Hemos enviado un código SMS al celular registrado a tu cédula.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required 
                  maxLength={6}
                  placeholder="Ingresa el PIN de 6 dígitos" 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1.2rem', textAlign: 'center', outline: 'none', letterSpacing: '2px' }} 
                />
              </div>

              {errorMsg && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>{errorMsg}</div>}

              <button 
                type="submit" 
                disabled={isProcessing}
                style={{ width: '100%', backgroundColor: isProcessing ? '#9ca3af' : '#00b050', color: '#fff', padding: '1rem', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
              >
                {isProcessing ? 'Verificando y Aprobando...' : 'Confirmar Pago'}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                disabled={isProcessing}
                style={{ width: '100%', backgroundColor: 'transparent', color: '#6b7280', padding: '1rem', border: 'none', fontSize: '0.9rem', marginTop: '0.5rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Volver atrás
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SistecreditoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando pasarela Sistecrédito...</div>}>
      <SistecreditoGateway />
    </Suspense>
  )
}
