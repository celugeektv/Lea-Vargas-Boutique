'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import styles from '../admin.module.css'

export default function AccountingFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const currentMonth = searchParams.get('month') || new Date().getMonth() + 1
  const currentYear = searchParams.get('year') || new Date().getFullYear()

  const handleFilterChange = (month: number, year: number) => {
    router.push(`${pathname}?month=${month}&year=${year}`)
  }

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ]

  const years = [2025, 2026, 2027]

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <select 
        className={styles.modernInput} 
        style={{ width: 'auto', padding: '0.5rem 1rem' }}
        value={currentMonth}
        onChange={(e) => handleFilterChange(Number(e.target.value), Number(currentYear))}
      >
        {months.map(m => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      
      <select 
        className={styles.modernInput} 
        style={{ width: 'auto', padding: '0.5rem 1rem' }}
        value={currentYear}
        onChange={(e) => handleFilterChange(Number(currentMonth), Number(e.target.value))}
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}
