import { getTransactions, getAccountingSummary, getDailyClosing, getTopSellingGarments } from '@/actions/accounting'
import styles from '../admin.module.css'
import AddTransactionForm from './AddTransactionForm'
import AccountingFilter from './AccountingFilter'
import PrintReportButton from '@/components/Admin/PrintReportButton'

export default async function AdminAccountingPage({ searchParams }: { searchParams: Promise<{ month?: string, year?: string }> }) {
  const params = await searchParams
  const month = params.month ? parseInt(params.month) : new Date().getMonth() + 1
  const year = params.year ? parseInt(params.year) : new Date().getFullYear()

  const transactions = await getTransactions(month, year)
  const summary = await getAccountingSummary(month, year)
  
  const dailyClosing = await getDailyClosing()
  const topGarments = await getTopSellingGarments(month, year)

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const currentMonthName = monthNames[month - 1]

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: '2.25rem', letterSpacing: '-0.04em' }}>Finanzas</h1>
          <p style={{ color: '#71717a', marginTop: '0.25rem' }}>Resumen del mes de {currentMonthName} {year}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="no-print">
          <AccountingFilter />
          <PrintReportButton />
        </div>
      </div>

      <div className={styles.fintechGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        
        <div className={`${styles.fintechCard} ${styles.cardProfit}`} style={{ borderBottom: '4px solid #6366f1' }}>
          <div className={styles.fintechHeader}>
            <div className={styles.fintechIconWrapper} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </div>
            <h3 className={styles.fintechTitle}>Ventas Concretadas</h3>
          </div>
          <p className={styles.fintechAmount}>{summary.totalSales}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontSize: '0.875rem', fontWeight: 600 }}>
            Pedidos exitosos este mes
          </div>
        </div>

        <div className={`${styles.fintechCard} ${styles.cardIncome}`}>
          <div className={styles.fintechHeader}>
            <div className={`${styles.fintechIconWrapper} ${styles.incomeIcon}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <h3 className={styles.fintechTitle}>Ingresos Brutos</h3>
          </div>
          <p className={styles.fintechAmount}>${summary.totalIncome.toLocaleString()}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            Dinero entrante
          </div>
        </div>
        
        <div className={`${styles.fintechCard} ${styles.cardExpense}`}>
          <div className={styles.fintechHeader}>
            <div className={`${styles.fintechIconWrapper} ${styles.expenseIcon}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"></path></svg>
            </div>
            <h3 className={styles.fintechTitle}>Gastos Operativos</h3>
          </div>
          <p className={styles.fintechAmount}>${summary.totalExpense.toLocaleString()}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', fontSize: '0.875rem', fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
            Egresos
          </div>
        </div>
        
        <div className={`${styles.fintechCard} ${styles.cardProfit}`}>
          <div className={styles.fintechHeader}>
            <div className={`${styles.fintechIconWrapper} ${styles.profitIcon}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            </div>
            <h3 className={styles.fintechTitle}>Rentabilidad Neta</h3>
          </div>
          <p className={styles.fintechAmount}>${summary.netProfit.toLocaleString()}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: summary.netProfit >= 0 ? '#10b981' : '#f43f5e', fontSize: '0.875rem', fontWeight: 600 }}>
            {summary.netProfit >= 0 ? 'Negocio rentable' : 'Se requieren ajustes'}
          </div>
        </div>
      </div>

      <div className={styles.fintechForm}>
        <div className={styles.fintechFormHeader}>
          <h2 className={styles.fintechFormTitle}>Añadir Transacción</h2>
          <p className={styles.fintechFormDesc}>Registra gastos operativos (bolsas, envíos, gasolina) o ingresos extra manuales.</p>
        </div>
        <AddTransactionForm />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Cierre Diario */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Cierre de Hoy ({new Date().toLocaleDateString()})</h2>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>Ventas en Tienda (POS)</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>${dailyClosing?.posSales.toLocaleString() || '0'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>Ventas Web (Online)</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>${dailyClosing?.webSales.toLocaleString() || '0'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>Gastos del día</span>
              <span style={{ fontWeight: 600, color: '#f43f5e' }}>-${dailyClosing?.totalExpense.toLocaleString() || '0'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>NETO DEL DÍA</span>
              <span style={{ fontWeight: 700, color: '#10b981', fontSize: '1.25rem' }}>${dailyClosing?.netProfit.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>

        {/* Prendas más vendidas */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Prendas Más Vendidas</h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {topGarments.length === 0 ? (
              <p style={{ color: '#a1a1aa', textAlign: 'center', margin: '2rem 0' }}>No hay ventas en este periodo</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topGarments.slice(0, 5).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#64748b', fontSize: '0.8rem' }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.variant}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#059669' }}>{item.quantity} und.</div>
                      <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>${item.total.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Historial Contable ({transactions.length})</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Transacción</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Ref. Orden</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                    <svg style={{ margin: '0 auto 1rem', display: 'block', color: '#d4d4d8' }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    Aún no hay registros contables
                  </td>
                </tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontSize: '0.85rem', color: '#71717a' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        backgroundColor: t.type === 'INCOME' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                        color: t.type === 'INCOME' ? '#10b981' : '#f43f5e'
                      }}>
                        {t.type === 'INCOME' ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>}
                        {t.type === 'INCOME' ? 'INGRESO' : 'EGRESO'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, color: '#27272a' }}>{t.description}</td>
                    <td style={{ fontWeight: 700, fontSize: '1.05rem', color: t.type === 'INCOME' ? '#10b981' : '#09090b' }}>
                      {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#a1a1aa', fontFamily: 'monospace' }}>
                      {t.referenceId || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
