import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function PagoExitoPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams
  const orderId = params.orderId

  let order = null
  if (orderId) {
    order = await prisma.order.findUnique({ where: { id: orderId } })
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
      
      <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#09090b', marginBottom: '1rem', letterSpacing: '-0.05em' }}>¡Pago Exitoso!</h1>
      <p style={{ fontSize: '1.1rem', color: '#71717a', maxWidth: '500px', marginBottom: '2rem' }}>
        Tu compra ha sido procesada correctamente y ya estamos preparando tu pedido. Te enviaremos un correo con el número de guía cuando sea despachado.
      </p>

      {order && (
        <div style={{ backgroundColor: '#fafafa', border: '1px solid #e4e4e7', padding: '1.5rem', borderRadius: '12px', width: '100%', maxWidth: '400px', marginBottom: '3rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: '#71717a' }}>Número de Orden</span>
            <strong style={{ fontFamily: 'monospace' }}>{order.orderNumber}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: '#71717a' }}>Estado del Pago</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Aprobado</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #e4e4e7', marginTop: '0.75rem' }}>
            <span style={{ fontWeight: 600, color: '#09090b' }}>Total Pagado</span>
            <strong style={{ fontSize: '1.1rem' }}>${order.total.toLocaleString()}</strong>
          </div>
        </div>
      )}

      <Link href="/catalogo" style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '1rem 2.5rem', borderRadius: '30px', fontWeight: 600, textDecoration: 'none', transition: 'transform 0.2s' }}>
        Seguir Comprando
      </Link>
    </div>
  )
}
