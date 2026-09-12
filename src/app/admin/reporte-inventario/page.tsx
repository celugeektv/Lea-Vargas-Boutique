import styles from '../reporte/reporte.module.css'
import { getInventory } from '@/actions/inventory'
import { getCategories } from '@/actions/categorias'
import Script from 'next/script'

export default async function ReporteInventario({ searchParams }: { searchParams: Promise<{ q?: string, category?: string }> }) {
  const params = await searchParams
  const q = params.q || ''
  const categoryId = params.category || ''

  const inventoryItems = await getInventory(q, categoryId)
  const categories = await getCategories()
  
  const categoryName = categoryId ? categories.find(c => c.id === categoryId)?.name || 'Específica' : 'Todas las Categorías'

  const totalUnits = inventoryItems.reduce((acc, item) => acc + item.stock, 0)
  const lowStockCount = inventoryItems.filter(item => item.stock > 0 && item.stock <= item.minStock).length
  const outOfStockCount = inventoryItems.filter(item => item.stock === 0).length

  return (
    <>
      <div className={styles.printActions} style={{ backgroundColor: '#f8fafc', padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <p style={{ marginBottom: '1rem', color: '#64748b' }}>Este documento está optimizado para imprimirse en tamaño A4.</p>
        <button 
          className={styles.printBtn}
          onClick="window.print()"
          type="button"
        >
          🖨️ Guardar como PDF / Imprimir
        </button>
      </div>

      <div className={styles.documentPage}>
        
        {/* Encabezado */}
        <header className={styles.header}>
          <div>
            <img src="/logo.png" alt="Lea Vargas Beauty Boutique" style={{ height: '40px' }} />
            <div className={styles.brandSub}>Boutique</div>
          </div>
          <div className={styles.companyInfo}>
            <div>Dg. 31 #58a-140, Cartagena de Indias</div>
            <div>WhatsApp: 3002433291</div>
            <div>ventasleavargascol@hotmail.com</div>
            <div>Generado: {new Date().toLocaleDateString('es-CO')}</div>
          </div>
        </header>

        {/* Título del Reporte */}
        <div className={styles.reportTitle}>Reporte de Inventario y Existencias</div>
        <div className={styles.reportPeriod}>Categoría: {categoryName} {q && `| Filtro: "${q}"`}</div>

        {/* Resumen Financiero */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryBox}>
            <div className={styles.summaryLabel}>Total Unidades</div>
            <div className={styles.summaryValue}>{totalUnits.toLocaleString()}</div>
          </div>
          <div className={styles.summaryBox}>
            <div className={styles.summaryLabel}>SKUs en Buen Estado</div>
            <div className={styles.summaryValue}>{inventoryItems.length - lowStockCount - outOfStockCount}</div>
          </div>
          <div className={styles.summaryBox}>
            <div className={styles.summaryLabel}>SKUs con Bajo Stock</div>
            <div className={styles.summaryValue} style={{ color: '#f59e0b' }}>{lowStockCount}</div>
          </div>
          <div className={`${styles.summaryBox} ${styles.profit}`}>
            <div className={styles.summaryLabel}>SKUs Agotados</div>
            <div className={styles.summaryValue} style={{ color: outOfStockCount > 0 ? '#dc2626' : '#059669' }}>
              {outOfStockCount}
            </div>
          </div>
        </div>

        {/* Lista de Inventario */}
        <h2 className={styles.sectionTitle}>Detalle de Existencias</h2>
        {inventoryItems.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto y Variante</th>
                <th className={styles.textRight}>Stock Actual</th>
                <th className={styles.textRight}>Stock Mínimo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map(item => {
                let status = 'Normal'
                let colorClass = ''
                if (item.stock === 0) {
                  status = 'Agotado'
                  colorClass = styles.negative
                } else if (item.stock <= item.minStock) {
                  status = 'Bajo Stock'
                  colorClass = '' // orange if we had it, fallback to default or we can inline style
                } else {
                  colorClass = styles.positive
                }

                return (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'monospace', color: '#555' }}>{item.sku}</td>
                    <td>
                      <strong>{item.productName}</strong><br/>
                      <span style={{ fontSize: '8pt', color: '#666' }}>{item.variantName}</span>
                    </td>
                    <td className={`${styles.textRight} ${colorClass}`} style={{ fontWeight: 'bold' }}>{item.stock}</td>
                    <td className={styles.textRight}>{item.minStock}</td>
                    <td className={colorClass} style={status === 'Bajo Stock' ? { color: '#b45309', fontWeight: 'bold' } : { fontWeight: 'bold' }}>
                      {status}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic' }}>No hay productos que coincidan con la búsqueda.</p>
        )}

        <div style={{ marginTop: '4rem', textAlign: 'center', fontSize: '8pt', color: '#999', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          Documento generado automáticamente por el sistema de Lea Vargas Boutique.
        </div>

      </div>
      
      <Script id="print-script" strategy="afterInteractive">
        {`
          document.querySelector('.${styles.printBtn}')?.addEventListener('click', () => {
            window.print();
          });
        `}
      </Script>
    </>
  )
}
