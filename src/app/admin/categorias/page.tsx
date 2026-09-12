import Link from 'next/link'
import styles from '../admin.module.css'
import { getCategories } from '@/actions/categorias'

export default async function CategoriasPage() {
  const categorias = await getCategories()

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Categorías</h1>
        <Link href="/admin/categorias/nueva" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          + Nueva Categoría
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Listado de Categorías</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Slug (URL)</th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No hay categorías registradas.</td>
              </tr>
            )}
            {categorias.map(cat => (
              <tr key={cat.id}>
                <td><strong style={{ color: '#09090b' }}>{cat.name}</strong></td>
                <td style={{ color: '#71717a' }}>/{cat.slug}</td>
                <td>{cat._count.products} items</td>
                <td>
                  <span className={`${styles.badge} ${cat.isActive ? styles['badge-paid'] : styles['badge-pending']}`}>
                    {cat.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Editar</button>
                  <span style={{ color: '#e4e4e7', margin: '0 8px' }}>|</span>
                  <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
