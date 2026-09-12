'use client'

import { useState, useEffect, FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './checkout.module.css'
import homeStyles from '../page.module.css'
import { useCartStore } from '@/store/cartStore'
import { createOrder } from '@/actions/orders'
import { colombiaData, departments } from '@/lib/colombiaData'
import Header from '@/components/Layout/Header'

export default function CheckoutPage() {
  const router = useRouter()
  const cartItems = useCartStore((state) => state.items)
  const cartTotal = useCartStore((state) => state.getTotal())
  const clearCart = useCartStore((state) => state.clearCart)

  const [isClient, setIsClient] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Opciones: mercadopago, tarjeta, addi, tienda, contra_entrega
  const [paymentMethod, setPaymentMethod] = useState('mercadopago')
  
  // Costo de envío dinámico
  const [shipping, setShipping] = useState(0)
  
  // Formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    department: 'Antioquia',
    city: 'Medellín',
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calcular envío según departamento
  useEffect(() => {
    if (paymentMethod === 'tienda') {
      setShipping(0)
    } else {
      // Regla de ejemplo: Bogotá cuesta menos, el resto del país más.
      if (formData.department === 'Bogotá D.C.') {
        setShipping(10000)
      } else {
        setShipping(15000)
      }
    }
  }, [formData.department, paymentMethod])

  const subtotal = cartTotal
  const total = subtotal + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'department') {
      const firstCity = colombiaData[value]?.[0] || ''
      setFormData(prev => ({ ...prev, department: value, city: firstCity }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSubmitting(true)

    const res = await createOrder(formData, cartItems, paymentMethod, subtotal, shipping, total)
    
    if (res.success && res.redirectUrl) {
      clearCart() // Vaciamos el carrito porque la orden fue generada
      router.push(res.redirectUrl)
    } else {
      setErrorMsg(res.error || 'Ocurrió un error inesperado.')
      setIsSubmitting(false)
    }
  }

  // Evitar hydration errors con Zustand
  if (!isClient) return null

  if (cartItems.length === 0) {
    return (
      <main style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Tu carrito está vacío</h2>
        <Link href="/catalogo" className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver a la tienda</Link>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Header />

      <div className={styles.checkoutContainer}>
        <div className={styles.leftColumn}>
          <form id="checkout-form" onSubmit={handleSubmit}>
            
            <section>
              <h2 className={styles.sectionTitle}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', backgroundColor: '#000', color: '#fff', borderRadius: '50%', fontSize: '0.875rem' }}>1</span>
                Información de Contacto
              </h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Correo Electrónico</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={styles.input} placeholder="tu@email.com" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Teléfono (Para WhatsApp)</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className={styles.input} placeholder="+57 300 000 0000" />
                </div>
              </div>
            </section>

            <section>
              <h2 className={styles.sectionTitle}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', backgroundColor: '#000', color: '#fff', borderRadius: '50%', fontSize: '0.875rem' }}>2</span>
                Dirección de Envío
              </h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nombre</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Apellidos</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className={styles.input} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Dirección</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required={paymentMethod !== 'tienda'} className={styles.input} placeholder="Calle, Carrera, Avenida..." />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Apartamento, local, etc. (Opcional)</label>
                  <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Departamento</label>
                  <select name="department" value={formData.department} onChange={handleInputChange} className={styles.input}>
                    {departments.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Ciudad</label>
                  <select name="city" value={formData.city} onChange={handleInputChange} required className={styles.input}>
                    {colombiaData[formData.department]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h2 className={styles.sectionTitle}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', backgroundColor: '#000', color: '#fff', borderRadius: '50%', fontSize: '0.875rem' }}>3</span>
                Método de Pago / Entrega
              </h2>
              <div className={styles.paymentMethods}>
                <label className={`${styles.paymentOption} ${paymentMethod === 'mercadopago' ? styles.selected : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#09090b' }}>Pago en Línea (Tarjetas o PSE)</div>
                    <div style={{ fontSize: '0.85rem', color: '#71717a', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      Procesado por Mercado Pago
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ backgroundColor: '#f4f4f5', color: '#09090b', padding: '2px 6px', border: '1px solid #e4e4e7', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>PSE</div>
                    <div style={{ backgroundColor: '#f4f4f5', color: '#09090b', padding: '2px 6px', border: '1px solid #e4e4e7', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>VISA</div>
                  </div>
                </label>

                <label className={`${styles.paymentOption} ${paymentMethod === 'addi' ? styles.selected : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'addi'} onChange={() => setPaymentMethod('addi')} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Paga después con ADDI</div>
                    <div style={{ fontSize: '0.85rem', color: '#71717a' }}>Hasta 3 cuotas sin interés</div>
                  </div>
                  <div style={{ backgroundColor: '#00d2ff', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>ADDI</div>
                </label>

                <label className={`${styles.paymentOption} ${paymentMethod === 'sistecredito' ? styles.selected : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'sistecredito'} onChange={() => setPaymentMethod('sistecredito')} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Paga con Sistecrédito</div>
                    <div style={{ fontSize: '0.85rem', color: '#71717a' }}>Crédito rápido, lo hacemos posible</div>
                  </div>
                  <div style={{ backgroundColor: '#00b050', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Sistecrédito</div>
                </label>

                <label className={`${styles.paymentOption} ${paymentMethod === 'contra_entrega' ? styles.selected : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'contra_entrega'} onChange={() => setPaymentMethod('contra_entrega')} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Pago Contra Entrega</div>
                    <div style={{ fontSize: '0.85rem', color: '#71717a' }}>Paga al recibir el producto en tu casa. Serás contactado por WhatsApp.</div>
                  </div>
                </label>

                <label className={`${styles.paymentOption} ${paymentMethod === 'tienda' ? styles.selected : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'tienda'} onChange={() => setPaymentMethod('tienda')} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Retiro en Tienda</div>
                    <div style={{ fontSize: '0.85rem', color: '#71717a' }}>Recoge y paga directamente en nuestro local (Envío Gratis).</div>
                  </div>
                </label>
              </div>
            </section>
          </form>
        </div>

        <div className={styles.rightColumn}>
          <h3 className={styles.summaryTitle}>Resumen del Pedido</h3>
          
          <div className={styles.summaryItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.itemImage}>
                  <Image src={item.image} alt={item.name} fill sizes="60px" style={{ objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{item.quantity}</span>
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemMeta}>{item.variant}</div>
                </div>
                <div className={styles.itemPrice}>${(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Envío ({paymentMethod === 'tienda' ? 'Retiro' : formData.department})</span>
              <span>${shipping.toLocaleString()}</span>
            </div>
            <div className={styles.grandTotalRow}>
              <span>Total a pagar</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</div>
          )}

          <button type="submit" form="checkout-form" disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? 'Procesando...' : `Confirmar Orden de $${total.toLocaleString()}`}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#a1a1aa', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Pago 100% encriptado y seguro
          </p>
        </div>
      </div>
    </main>
  )
}
