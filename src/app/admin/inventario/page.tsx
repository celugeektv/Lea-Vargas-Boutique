import Link from 'next/link'
import styles from '../admin.module.css'
import { getInventory } from '@/actions/inventory'
import { getCategories } from '@/actions/categorias'
import InventorySearch from '@/components/Admin/InventorySearch'
import PrintInventoryButton from '@/components/Admin/PrintInventoryButton'

export default async function InventarioPage({ searchParams }: { searchParams: Promise<{ q?: string, category?: string }> }) {
  const params = await searchParams
  const q = params.q || ''
  const categoryId = params.category || ''

  const inventoryItems = await getInventory(q, categoryId)
  const categories = await getCategories()

  // Calcular métricas
  const totalUnits = inventoryItems.reduce((acc, item) => acc + item.stock, 0)
  const lowStockCount = inventoryItems.filter(item => item.stock > 0 && item.stock <= item.minStock).length
  const outOfStockCount = inventoryItems.filter(item => item.stock === 0).length

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle} style={{ fontSize: '2.25rem', letterSpacing: '-0.04em' }}>Control de Inventario</h1>
        <div className="no-print">
          <PrintInventoryButton />
        </div>
      </div>

      <div className={styles.fintechGrid}>
        <div className={styles.fintechCard} style={{ borderBottom: '4px solid #10b981' }}>
          <div className={styles.fintechHeader}>
            <div className={styles.fintechIconWrapper} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
            <h3 className={styles.fintechTitle}>Unidades Totales</h3>
          </div>
          <p className={styles.fintechAmount}>{totalUnits.toLocaleString()}</p>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>
            En todos los almacenes
          </div>
        </div>
        
        <div className={styles.fintechCard} style={{ borderBottom: '4px solid #f59e0b' }}>
          <div className={styles.fintechHeader}>
            <div className={styles.fintechIconWrapper} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3 className={styles.fintechTitle}>Bajo Stock</h3>
          </div>
          <p className={styles.fintechAmount}>{lowStockCount}</p>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b' }}>
            Requieren reabastecimiento
          </div>
        </div>
        
        <div className={styles.fintechCard} style={{ borderBottom: '4px solid #f43f5e' }}>
          <div className={styles.fintechHeader}>
            <div className={styles.fintechIconWrapper} style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            </div>
            <h3 className={styles.fintechTitle}>Agotados</h3>
          </div>
          <p className={styles.fintechAmount}>{outOfStockCount}</p>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f43f5e' }}>
            SKUs sin inventario
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.cardTitle} style={{ margin: 0 }}>Niveles de Existencias</h2>
          <InventorySearch categories={categories} />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto y Variante</th>
                <th>Stock Actual</th>
                <th>Mínimo Requerido</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                    No hay productos registrados en la base de datos.
                  </td>
                </tr>
              ) : (
                inventoryItems.map(item => {
                  let status = 'Normal'
                  if (item.stock === 0) status = 'Agotado'
                  else if (item.stock <= item.minStock) status = 'Bajo'

                  return (
                    <tr key={item.id}>
                      <td style={{ fontFamily: 'monospace', color: '#71717a', fontSize: '0.85rem' }}>{item.sku}</td>
                      <td>
                        <strong style={{ color: '#09090b', display: 'block', fontSize: '0.95rem' }}>{item.productName}</strong>
                        <span style={{ color: '#71717a', fontSize: '0.8rem' }}>{item.variantName}</span>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: 700, 
                          color: status === 'Agotado' ? '#f43f5e' : status === 'Bajo' ? '#f59e0b' : '#09090b'
                        }}>
                          {item.stock}
                        </span>
                      </td>
                      <td style={{ color: '#71717a', fontWeight: 500 }}>{item.minStock}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', 
                          padding: '0.35rem 0.75rem', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem', 
                          fontWeight: 700,
                          backgroundColor: status === 'Normal' ? 'rgba(16, 185, 129, 0.1)' : 
                                          status === 'Bajo' ? 'rgba(245, 158, 11, 0.1)' : 
                                          'rgba(244, 63, 94, 0.1)',
                          color: status === 'Normal' ? '#10b981' : 
                                status === 'Bajo' ? '#f59e0b' : 
                                '#f43f5e'
                        }}>
                          {status}
                        </span>
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
