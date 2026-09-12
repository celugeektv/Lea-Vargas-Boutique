'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'
import { login } from '@/actions/auth'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(password)
      
      if (result.success) {
        // Redirigir al dashboard
        router.push('/admin')
        router.refresh() // Para forzar actualización del layout
      } else {
        setError(result.error || 'Ocurrió un error al iniciar sesión')
        setPassword('')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        
        <div className={styles.loginHeader}>
            <div className={styles.logoContainer}>
              <img src="/logo.png" alt="Lea Vargas Beauty Boutique" style={{ height: '40px', width: 'auto', marginBottom: '1rem' }} />
            </div>
          <h1 className={styles.loginTitle}>Panel de Control</h1>
          <p className={styles.loginSubtitle}>Ingresa tu contraseña de seguridad</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.inputLabel}>
              Contraseña Maestra
            </label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>
            {error && (
              <div className={styles.errorMsg}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading || !password}>
            {isLoading ? (
              <div className={styles.loadingSpinner}></div>
            ) : (
              <>
                Acceder al Dashboard
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  )
}
