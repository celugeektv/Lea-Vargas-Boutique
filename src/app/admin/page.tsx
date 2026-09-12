import styles from './admin.module.css'
import { getOrders } from '@/actions/admin-orders'
import { getAccountingSummary } from '@/actions/accounting'
import Link from 'next/link'
import OrderStatusDropdown from './ordenes/OrderStatusDropdown'
import AccountingFilter from './contabilidad/AccountingFilter'
import PrintReportButton from '@/components/Admin/PrintReportButton'

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ month?: string, year?: string }> }) {
  const params = await searchParams
  const month = params.month ? parseInt(params.month) : new Date().getMonth() + 1
  const year = params.year ? parseInt(params.year) : new Date().getFullYear()

  const orders = await getOrders(month, year)
  const summary = await getAccountingSummary(month, year)

  // Calcular nuevos pedidos (pendientes)
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const totalOrders = orders.length
  
  // Calcular ticket promedio
  const avgTicket = totalOrders > 0 ? (summary.totalIncome / totalOrders) : 0

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const currentMonthName = monthNames[month - 1]

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: '2.25rem', letterSpacing: '-0.04em' }}>Dashboard General</h1>
          <p style={{ color: '#71717a', marginTop: '0.25rem' }}>Métricas del mes de {currentMonthName} {year}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="no-print">
          <AccountingFilter />
          <PrintReportButton />
        </div>
      </div>
      
      {/* Indicadores Clave (Widgets) */}
      <div className={styles.fintechGrid}>
        
        <div className={`${styles.fintechCard}`} style={{ borderBottom: '4px solid #f59e0b' }}>
          <div className={styles.fintechHeader}>
            <div className={styles.fintechIconWrapper} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3 className={styles.fintechTitle}>Pedidos Nuevos</h3>
          </div>
          <p className={styles.fintechAmount}>{orders.filter(o => o.status === 'PENDING').length}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.875rem', fontWeight: 600 }}>
            Requieren revisión inmediata
          </div>
        </div>
        
        <div className={`${styles.fintechCard}`} style={{ borderBottom: '4px solid #3b82f6' }}>
          <div className={styles.fintechHeader}>
            <div className={styles.fintechIconWrapper} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3 className={styles.fintechTitle}>Empacando</h3>
          </div>
          <p className={styles.fintechAmount}>{orders.filter(o => o.status === 'PROCESSING' || o.status === 'PAID').length}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.875rem', fontWeight: 600 }}>
            En proceso de alistamiento
          </div>
        </div>
        
        <div className={`${styles.fintechCard}`} style={{ borderBottom: '4px solid #10b981' }}>
          <div className={styles.fintechHeader}>
            <div className={styles.fintechIconWrapper} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <h3 className={styles.fintechTitle}>Despachados</h3>
          </div>
          <p className={styles.fintechAmount}>{orders.filter(o => o.status === 'SHIPPED' || o.status === 'DELIVERED').length}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>
            Entregados a transportadora
          </div>
        </div>

      </div>

      {/* Tabla Premium */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Últimos Pedidos Recibidos ({currentMonthName})</h2>
          <Link href="/admin/ordenes" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Ver todos</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nº Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado Rápido</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => {
                let parsedAddress: any = {}
                try {
                  parsedAddress = JSON.parse(order.shippingAddress)
                } catch (e) {}

                return (
                  <tr key={order.id}>
                    <td><strong style={{ color: '#09090b', fontFamily: 'monospace' }}>{order.orderNumber}</strong></td>
                    <td>{parsedAddress.firstName} {parsedAddress.lastName}</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>${order.total.toLocaleString()}</td>
                    <td>
                      <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                )
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                    <svg style={{ margin: '0 auto 1rem', display: 'block', color: '#d4d4d8' }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    No hay pedidos registrados en este mes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
