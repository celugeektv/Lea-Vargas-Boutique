import styles from './reporte.module.css'
import { getAccountingSummary, getTransactions, getTopSellingGarments } from '@/actions/accounting'
import { getOrders } from '@/actions/admin-orders'
import Script from 'next/script'

export default async function ReporteMensual({ searchParams }: { searchParams: Promise<{ month?: string, year?: string }> }) {
  const params = await searchParams
  const month = params.month ? parseInt(params.month) : new Date().getMonth() + 1
  const year = params.year ? parseInt(params.year) : new Date().getFullYear()

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const currentMonthName = monthNames[month - 1]

  const summary = await getAccountingSummary(month, year)
  const transactions = await getTransactions(month, year)
  const topGarments = await getTopSellingGarments(month, year)

  // Desglosar transacciones en ingresos extra y egresos
  const manualIncomes = transactions.filter(t => t.type === 'INCOME')
  const manualExpenses = transactions.filter(t => t.type === 'EXPENSE')

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
        <div className={styles.reportTitle}>Reporte Contable y de Ventas</div>
        <div className={styles.reportPeriod}>Periodo: {currentMonthName} {year}</div>

        {/* Resumen Financiero */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryBox}>
            <div className={styles.summaryLabel}>Total Pedidos</div>
            <div className={styles.summaryValue}>{summary.totalSales}</div>
          </div>
          <div className={styles.summaryBox}>
            <div className={styles.summaryLabel}>Ingresos Brutos</div>
            <div className={styles.summaryValue}>${summary.totalIncome.toLocaleString()}</div>
          </div>
          <div className={styles.summaryBox}>
            <div className={styles.summaryLabel}>Egresos / Gastos</div>
            <div className={styles.summaryValue} style={{ color: '#dc2626' }}>${summary.totalExpense.toLocaleString()}</div>
          </div>
          <div className={`${styles.summaryBox} ${styles.profit}`}>
            <div className={styles.summaryLabel}>Utilidad Neta</div>
            <div className={styles.summaryValue} style={{ color: summary.netProfit >= 0 ? '#059669' : '#dc2626' }}>
              ${summary.netProfit.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Top Ventas */}
        <h2 className={styles.sectionTitle}>Productos Más Vendidos</h2>
        {topGarments.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Variante (Talla/Color)</th>
                <th className={styles.textRight}>Cantidad</th>
                <th className={styles.textRight}>Total Recaudado</th>
              </tr>
            </thead>
            <tbody>
              {topGarments.slice(0, 10).map((g, i) => (
                <tr key={i}>
                  <td>{g.name}</td>
                  <td>{g.variant}</td>
                  <td className={styles.textRight}>{g.quantity}</td>
                  <td className={styles.textRight}>${g.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic' }}>No hay ventas registradas en este periodo.</p>
        )}

        {/* Desglose de Gastos */}
        <h2 className={styles.sectionTitle}>Desglose de Egresos y Gastos Operativos</h2>
        {manualExpenses.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th className={styles.textRight}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {manualExpenses.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.createdAt).toLocaleDateString('es-CO')}</td>
                  <td>{t.category}</td>
                  <td>{t.description}</td>
                  <td className={`${styles.textRight} ${styles.negative}`}>-${t.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic' }}>No hay gastos registrados en este periodo.</p>
        )}

        {/* Otros Ingresos (Manuales) */}
        {manualIncomes.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Otros Ingresos (Manuales)</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th className={styles.textRight}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {manualIncomes.map(t => (
                  <tr key={t.id}>
                    <td>{new Date(t.createdAt).toLocaleDateString('es-CO')}</td>
                    <td>{t.category}</td>
                    <td>{t.description}</td>
                    <td className={`${styles.textRight} ${styles.positive}`}>${t.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div style={{ marginTop: '4rem', textAlign: 'center', fontSize: '8pt', color: '#999', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          Documento generado automáticamente por el sistema de Lea Vargas Boutique.
          <br/>
          Página 1 de 1
        </div>

      </div>
      
      {/* Script para imprimir el documento automáticamente cuando se abre (opcional, mejor dejar el botón) */}
      <Script id="print-script" strategy="afterInteractive">
        {`
          // Add click event to print button to bypass React Server Component restrictions on onClick string
          document.querySelector('.${styles.printBtn}')?.addEventListener('click', () => {
            window.print();
          });
        `}
      </Script>
    </>
  )
}
