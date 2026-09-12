'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/actions/admin-orders'
import styles from '../admin.module.css'

export default function OrderStatusDropdown({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    setIsUpdating(true)
    
    const res = await updateOrderStatus(orderId, newStatus)
    if (!res.success) {
      alert('Error: ' + res.error)
      setStatus(currentStatus) // revertir
    }
    
    setIsUpdating(false)
  }

  return (
    <select 
      value={status} 
      onChange={handleStatusChange} 
      disabled={isUpdating}
      className={styles.input}
      style={{ 
        padding: '0.25rem 0.5rem', 
        fontSize: '0.85rem',
        borderRadius: '4px',
        border: '1px solid #e4e4e7',
        backgroundColor: status === 'PAID' ? '#dcfce7' : status === 'SHIPPED' ? '#dbeafe' : '#f1f5f9',
        color: status === 'PAID' ? '#166534' : status === 'SHIPPED' ? '#1e40af' : '#475569',
        fontWeight: 600
      }}
    >
      <option value="PENDING">Pendiente</option>
      <option value="PAID">Pagado</option>
      <option value="SHIPPED">Enviado</option>
      <option value="DELIVERED">Entregado</option>
      <option value="CANCELLED">Cancelado</option>
    </select>
  )
}
