'use client'

import { useState } from 'react'
import { addTransaction } from '@/actions/accounting'
import styles from '../admin.module.css'

export default function AddTransactionForm() {
  const [type, setType] = useState('EXPENSE')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = await addTransaction({
      type,
      amount: parseFloat(amount),
      description
    })

    if (res.success) {
      setAmount('')
      setDescription('')
      alert('Transacción agregada con éxito')
    } else {
      alert('Error: ' + res.error)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.fintechInputGroup}>
      <div>
        <label className={styles.modernLabel}>Clasificación</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className={styles.modernInput}>
          <option value="EXPENSE">Egreso (Gasto Operativo)</option>
          <option value="INCOME">Ingreso (Entrada Manual)</option>
        </select>
      </div>
      
      <div>
        <label className={styles.modernLabel}>Concepto o Descripción</label>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className={styles.modernInput} 
          placeholder="Ej. Compra de empaques y bolsas" 
          required 
        />
      </div>
      
      <div>
        <label className={styles.modernLabel}>Valor ($)</label>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          className={styles.modernInput} 
          placeholder="0.00" 
          required 
          min="1"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', gridColumn: '1 / -1', marginTop: '0.5rem' }}>
        <button type="submit" disabled={isSubmitting} className={styles.fintechBtn}>
          {isSubmitting ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Registrar Movimiento
            </>
          )}
        </button>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </form>
  )
}
