'use client'

import { useState } from 'react'
import styles from '../admin.module.css'
import { updateAdminPassword } from '@/actions/settings'

export default function ConfiguracionPage() {
  const [loadingConfig, setLoadingConfig] = useState<string | null>(null)
  
  // States para la contraseña
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' })

  const handleSavePassword = async () => {
    if (!newPassword || newPassword.length < 4) {
      setPasswordMsg({ text: 'La contraseña debe tener mínimo 4 caracteres', type: 'error' })
      return
    }

    setLoadingConfig('security')
    setPasswordMsg({ text: '', type: '' })
    
    const result = await updateAdminPassword(newPassword)
    
    if (result.success) {
      setPasswordMsg({ text: 'Contraseña actualizada correctamente', type: 'success' })
      setNewPassword('')
    } else {
      setPasswordMsg({ text: result.error || 'Error al actualizar', type: 'error' })
    }
    
    setLoadingConfig(null)
  }

  const handleSave = (section: string) => {
    setLoadingConfig(section)
    // Simular guardado para otras secciones
    setTimeout(() => {
      setLoadingConfig(null)
    }, 1000)
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Configuración</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Administra los parámetros globales de la tienda</p>
        </div>
      </div>
      
      <div className={styles.dashboardGrid}>
        
        {/* TARJETA 1: SEGURIDAD */}
        <div className={styles.card} style={{ marginBottom: 0 }}>
          <div className={styles.cardHeader} style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.05)', padding: '0.5rem', borderRadius: '10px', color: '#0f172a' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h2 className={styles.cardTitle}>Seguridad y Acceso</h2>
            </div>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className={styles.inputLabel} style={{ marginBottom: '0.5rem', display: 'block', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nueva Contraseña</label>
                <input 
                  type="password" 
                  placeholder="Nueva contraseña segura" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', outline: 'none' }} 
                />
              </div>
              {passwordMsg.text && (
                <div style={{ fontSize: '0.85rem', color: passwordMsg.type === 'error' ? '#dc2626' : '#059669', fontWeight: 500 }}>
                  {passwordMsg.text}
                </div>
              )}
            </div>
            <button 
              onClick={handleSavePassword}
              disabled={loadingConfig === 'security'}
              style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#0f172a', color: 'white', borderRadius: '10px', fontWeight: 600, cursor: loadingConfig === 'security' ? 'not-allowed' : 'pointer', border: 'none', transition: 'all 0.2s', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              {loadingConfig === 'security' ? 'Guardando...' : 'Actualizar Contraseña'}
            </button>
          </div>
        </div>

        {/* TARJETA 2: ENVÍOS */}
        <div className={styles.card} style={{ marginBottom: 0 }}>
          <div className={styles.cardHeader} style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(5, 150, 105, 0.1)', padding: '0.5rem', borderRadius: '10px', color: '#059669' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <h2 className={styles.cardTitle}>Costos de Envío</h2>
            </div>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ marginBottom: '0.5rem', display: 'block', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tarifa Base Nacional (COP)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>$</span>
                  <input type="number" defaultValue={15000} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ marginBottom: '0.5rem', display: 'block', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monto para Envío Gratis (COP)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>$</span>
                  <input type="number" defaultValue={250000} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', outline: 'none' }} />
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleSave('shipping')}
              style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#0f172a', color: 'white', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              {loadingConfig === 'shipping' ? 'Guardando...' : 'Guardar Políticas de Envío'}
            </button>
          </div>
        </div>

        {/* TARJETA 3: PASARELAS DE PAGO */}
        <div className={styles.card} style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
          <div className={styles.cardHeader} style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '0.5rem', borderRadius: '10px', color: '#2563eb' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <h2 className={styles.cardTitle}>Integraciones de Pago</h2>
            </div>
          </div>
          
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* MercadoPago */}
            <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0ea5e9' }}>MercadoPago</h3>
                <span className={`${styles.badge} ${styles['badge-paid']}`}>Conectado</span>
              </div>
              <label style={{ marginBottom: '0.5rem', display: 'block', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access Token (Producción)</label>
              <input type="password" defaultValue="APP_USR-893475983475-xxxxxxxx" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', outline: 'none', marginBottom: '1rem', fontFamily: 'monospace' }} />
              <button style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Probar Conexión</button>
            </div>

            {/* ADDI */}
            <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4f46e5' }}>ADDI</h3>
                <span className={`${styles.badge} ${styles['badge-pending']}`} style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>Inactivo</span>
              </div>
              <label style={{ marginBottom: '0.5rem', display: 'block', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client ID</label>
              <input type="text" placeholder="Ingresa tu Client ID" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', outline: 'none', marginBottom: '1rem', fontFamily: 'monospace' }} />
              <button style={{ padding: '0.5rem 1rem', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Activar ADDI</button>
            </div>

            {/* Sistecrédito */}
            <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00b050' }}>Sistecrédito</h3>
                <span className={`${styles.badge} ${styles['badge-pending']}`} style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>Inactivo</span>
              </div>
              <label style={{ marginBottom: '0.5rem', display: 'block', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Api Key / Token Comercial</label>
              <input type="text" placeholder="Ingresa tu API Key de Sistecrédito" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', outline: 'none', marginBottom: '1rem', fontFamily: 'monospace' }} />
              <button style={{ padding: '0.5rem 1rem', backgroundColor: '#00b050', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Activar Sistecrédito</button>
            </div>
          </div>
        </div>

        {/* TARJETA 4: BACKUP Y RESTAURACIÓN */}
        <div className={styles.card} style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
          <div className={styles.cardHeader} style={{ padding: '1.5rem 2rem', backgroundColor: '#fff1f2', borderBottom: '1px solid #ffe4e6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#fecdd3', padding: '0.5rem', borderRadius: '10px', color: '#e11d48' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <h2 className={styles.cardTitle} style={{ color: '#e11d48' }}>Copias de Seguridad (Full Backup)</h2>
            </div>
          </div>
          
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* EXPORTAR */}
            <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Exportar Tienda</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Descarga un archivo ZIP con el 100% de tu base de datos y todas las fotografías de tus productos.</p>
              </div>
              <a 
                href="/api/backup/export" 
                style={{ marginTop: 'auto', padding: '0.75rem 1rem', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '8px', fontWeight: 600, textAlign: 'center', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
              >
                Descargar Copia de Seguridad (.zip)
              </a>
            </div>

            {/* IMPORTAR */}
            <div style={{ padding: '1.5rem', border: '1px solid #fecdd3', borderRadius: '16px', backgroundColor: '#fff1f2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e11d48' }}>Restaurar Tienda</h3>
                <p style={{ color: '#be123c', fontSize: '0.9rem', marginTop: '0.5rem' }}>Sube un archivo .zip de backup. <strong>Peligro:</strong> Esto sobreescribirá toda tu tienda actual de manera irreversible.</p>
              </div>
              
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!confirm("⚠️ ADVERTENCIA: Esta acción borrará toda tu tienda actual y la reemplazará con el contenido del backup. ¿Estás absolutamente seguro de continuar?")) return;
                  
                  const formData = new FormData(e.currentTarget);
                  setLoadingConfig('backup');
                  
                  try {
                    const res = await fetch('/api/backup/import', { method: 'POST', body: formData });
                    const data = await res.json();
                    if (data.success) {
                      alert('¡Restauración exitosa! La página se recargará ahora.');
                      window.location.reload();
                    } else {
                      alert(data.error || 'Ocurrió un error al restaurar.');
                    }
                  } catch (err) {
                    alert('Fallo de conexión.');
                  }
                  setLoadingConfig(null);
                }}
                style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <input type="file" name="backup" accept=".zip" required style={{ fontSize: '0.9rem', color: '#be123c' }} />
                <button 
                  type="submit" 
                  disabled={loadingConfig === 'backup'}
                  style={{ padding: '0.75rem 1rem', backgroundColor: '#e11d48', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: loadingConfig === 'backup' ? 'not-allowed' : 'pointer', fontSize: '0.95rem', opacity: loadingConfig === 'backup' ? 0.7 : 1 }}
                >
                  {loadingConfig === 'backup' ? 'Restaurando (No cerrar)...' : 'Subir y Restaurar'}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
