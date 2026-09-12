'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './pos.module.css'
import { createPOSOrder } from '@/actions/pos'

type Variant = { id: string, size: string, color: string, inventory?: { quantity: number } | null }
type Product = { id: string, name: string, price: number, imageUrl: string | null, variants: Variant[] }
type CartItem = { product: Product, variant: Variant, quantity: number }

export default function POSClient({ initialProducts }: { initialProducts: any[] }) {
  const [products] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  
  // Modal selection
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState('POS_CASH') // POS_CASH, POS_CARD, POS_TRANSFER
  const [discount, setDiscount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<any>(null)

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const total = Math.max(0, subtotal - discount)

  const openProductModal = (product: Product) => {
    if (product.variants.length === 1) {
      addToCart(product, product.variants[0])
    } else {
      setSelectedProduct(product)
    }
  }

  const addToCart = (product: Product, variant: Variant) => {
    setCart(prev => {
      const existing = prev.find(item => item.variant.id === variant.id)
      if (existing) {
        // Validar inventario máximo
        const maxQty = variant.inventory?.quantity || 0
        if (existing.quantity >= maxQty) return prev
        
        return prev.map(item => item.variant.id === variant.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { product, variant, quantity: 1 }]
    })
    setSelectedProduct(null)
  }

  const updateQuantity = (variantId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.variant.id === variantId) {
          const maxQty = item.variant.inventory?.quantity || 0
          const newQty = item.quantity + delta
          if (newQty <= 0) return { ...item, quantity: 0 } // Se filtrará abajo
          if (newQty > maxQty) return item
          return { ...item, quantity: newQty }
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setIsProcessing(true)

    const payload = {
      items: cart.map(item => ({
        variantId: item.variant.id,
        quantity: item.quantity,
        unitPrice: item.product.price
      })),
      paymentMethod,
      discount,
      total
    }

    const result = await createPOSOrder(payload)
    
    if (result.success) {
      setCompletedOrder({
        orderNumber: result.orderNumber,
        items: [...cart],
        subtotal,
        discount,
        total,
        paymentMethod,
        date: new Date()
      })
      setCart([])
      setDiscount(0)
    } else {
      alert(result.error || 'Error procesando la venta')
    }
    
    setIsProcessing(false)
  }

  return (
    <div className={styles.posContainer}>
      
      {/* Left: Products */}
      <div className={styles.productsSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Punto de Venta</h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Selecciona productos para facturar</p>
          </div>
          <a href="/admin/contabilidad" style={{ color: '#0f172a', textDecoration: 'underline', fontSize: '0.85rem', fontWeight: 600 }}>Volver a Contabilidad</a>
        </div>
        
        <input 
          type="text" 
          placeholder="Buscar producto..." 
          className={styles.searchBar}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        
        <div className={styles.productGrid}>
          {filteredProducts.map(product => (
            <div key={product.id} className={styles.productCard} onClick={() => openProductModal(product)}>
              <div className={styles.productImage}>
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>Sin foto</div>
                )}
              </div>
              <div className={styles.productInfo}>
                <div>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <div className={styles.productCategory}>{product.variants.reduce((sum, v) => sum + (v.inventory?.quantity || 0), 0)} en stock</div>
                </div>
                <div className={styles.productPrice}>${product.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className={styles.cartSection}>
        <div className={styles.cartHeader}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Caja / Factura</h2>
        </div>
        
        <div className={styles.cartBody}>
          {cart.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', opacity: 0.5 }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <p>El carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.variant.id} className={styles.cartItem}>
                <div className={styles.cartItemInfo}>
                  <div className={styles.cartItemTitle}>{item.product.name}</div>
                  <div className={styles.cartItemVariant}>{item.variant.color} - Talla {item.variant.size}</div>
                  <div style={{ color: '#059669', fontWeight: 600, fontSize: '0.9rem', marginTop: '4px' }}>
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </div>
                  <div className={styles.cartItemActions}>
                    <button className={styles.qtyBtn} onClick={() => updateQuantity(item.variant.id, -1)}>-</button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => updateQuantity(item.variant.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          
          <div className={styles.summaryRow} style={{ alignItems: 'center' }}>
            <span>Descuento Manual</span>
            <div style={{ position: 'relative', width: '100px' }}>
              <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }}>$</span>
              <input 
                type="number" 
                value={discount || ''} 
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0"
                style={{ width: '100%', padding: '4px 8px 4px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div className={styles.paymentMethods}>
            <button className={`${styles.payBtn} ${paymentMethod === 'POS_CASH' ? styles.active : ''}`} onClick={() => setPaymentMethod('POS_CASH')}>Efectivo</button>
            <button className={`${styles.payBtn} ${paymentMethod === 'POS_CARD' ? styles.active : ''}`} onClick={() => setPaymentMethod('POS_CARD')}>Datáfono</button>
            <button className={`${styles.payBtn} ${paymentMethod === 'POS_TRANSFER' ? styles.active : ''}`} onClick={() => setPaymentMethod('POS_TRANSFER')}>Transf/Nequi</button>
          </div>

          <div className={styles.summaryTotal}>
            <span>Total a Cobrar</span>
            <span style={{ color: '#059669' }}>${total.toLocaleString()}</span>
          </div>
          
          <button 
            className={styles.checkoutBtn} 
            disabled={cart.length === 0 || isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? 'Procesando...' : 'Facturar Venta'}
          </button>
        </div>
      </div>

      {/* Variant Modal */}
      {selectedProduct && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div className={styles.variantModal} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Seleccionar Talla/Color</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{selectedProduct.name}</p>
            
            <div className={styles.variantList}>
              {selectedProduct.variants.map(variant => {
                const stock = variant.inventory?.quantity || 0
                const isAvailable = stock > 0
                
                return (
                  <div 
                    key={variant.id} 
                    className={`${styles.variantItem} ${!isAvailable ? styles.disabled : ''}`}
                    onClick={() => {
                      if (isAvailable) addToCart(selectedProduct, variant)
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{variant.color} - Talla {variant.size}</div>
                      <div style={{ fontSize: '0.75rem', color: isAvailable ? '#059669' : '#dc2626', marginTop: '2px' }}>
                        {isAvailable ? `${stock} disponibles` : 'Agotado'}
                      </div>
                    </div>
                    {isAvailable && (
                      <div style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                        + Agregar
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', background: 'transparent', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {completedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.receiptModal} onClick={e => e.stopPropagation()}>
            <div className={styles.printArea}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img src="/logo.png" alt="Lea Vargas Beauty Boutique" style={{ height: '30px', margin: '0 auto 0.5rem auto', display: 'block' }} />
                <div style={{ fontSize: '0.7rem' }}>Dg. 31 #58a-140, Cartagena</div>
                <div style={{ fontSize: '0.7rem' }}>WhatsApp: 3002433291</div>
                <hr style={{ borderTop: '1px dashed #000', margin: '0.5rem 0' }} />
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Factura / Recibo</div>
                <div style={{ fontSize: '0.75rem' }}>Orden: {completedOrder.orderNumber}</div>
                <div style={{ fontSize: '0.75rem' }}>Fecha: {completedOrder.date.toLocaleString('es-CO')}</div>
              </div>
              
              <hr style={{ borderTop: '1px dashed #000', margin: '0.5rem 0' }} />
              
              <table style={{ width: '100%', fontSize: '0.75rem', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th style={{ paddingBottom: '4px' }}>Cant</th>
                    <th style={{ paddingBottom: '4px' }}>Producto</th>
                    <th style={{ paddingBottom: '4px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrder.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td style={{ verticalAlign: 'top' }}>{item.quantity}</td>
                      <td style={{ paddingRight: '4px' }}>
                        {item.product.name}
                        <br/>
                        <span style={{ fontSize: '0.65rem' }}>{item.variant.color} - {item.variant.size}</span>
                      </td>
                      <td style={{ textAlign: 'right', verticalAlign: 'top' }}>${(item.product.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr style={{ borderTop: '1px dashed #000', margin: '0.5rem 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span>Subtotal:</span>
                <span>${completedOrder.subtotal.toLocaleString()}</span>
              </div>
              {completedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span>Descuento:</span>
                  <span>-${completedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                <span>TOTAL:</span>
                <span>${completedOrder.total.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                Pago en: {completedOrder.paymentMethod.replace('POS_', '')}
              </div>

              <hr style={{ borderTop: '1px dashed #000', margin: '1rem 0' }} />
              <div style={{ textAlign: 'center', fontSize: '0.75rem' }}>
                ¡Gracias por tu compra!
                <br/>
                leavargas.com
              </div>
            </div>
            
            <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => window.print()} className={styles.printBtn}>
                🖨️ Imprimir (Térmica / PDF)
              </button>
              <button onClick={() => setCompletedOrder(null)} className={styles.closeReceiptBtn}>
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
