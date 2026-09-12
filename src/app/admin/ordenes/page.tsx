import { getOrders } from '@/actions/admin-orders'
import styles from '../admin.module.css'
import OrderStatusDropdown from './OrderStatusDropdown'
import AccountingFilter from '../contabilidad/AccountingFilter'

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ month?: string, year?: string }> }) {
  const params = await searchParams
  const month = params.month ? parseInt(params.month) : new Date().getMonth() + 1
  const year = params.year ? parseInt(params.year) : new Date().getFullYear()

  const orders = await getOrders(month, year)

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const currentMonthName = monthNames[month - 1]

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: '2.25rem', letterSpacing: '-0.04em' }}>Gestión de Órdenes</h1>
          <p style={{ color: '#71717a', marginTop: '0.25rem' }}>Pedidos del mes de {currentMonthName} {year}</p>
        </div>
        <AccountingFilter />
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Listado de Órdenes ({orders.length})</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nº Orden</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Método</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#71717a' }}>
                    No hay órdenes registradas.
                  </td>
                </tr>
              ) : (
                orders.map(order => {
                  let parsedAddress: any = {}
                  try {
                    parsedAddress = JSON.parse(order.shippingAddress)
                  } catch (e) {}

                  return (
                    <tr key={order.id}>
                      <td><strong style={{ color: '#09090b', fontFamily: 'monospace' }}>{order.orderNumber}</strong></td>
                      <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{parsedAddress.firstName} {parsedAddress.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{parsedAddress.city}</div>
                      </td>
                      <td style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>
                        {order.paymentMethod.replace('_', ' ')}
                      </td>
                      <td style={{ fontWeight: 600 }}>${order.total.toLocaleString()}</td>
                      <td>
                        <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
