import Link from 'next/link'
import styles from '../../admin.module.css'
import CategoryForm from '@/components/Admin/CategoryForm'

export default function NuevaCategoriaPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Crear Nueva Categoría</h1>
        <Link href="/admin/categorias" className="btn btn-secondary">
          Cancelar
        </Link>
      </div>

      <div className={styles.card} style={{ maxWidth: '600px', padding: '2rem' }}>
        <CategoryForm />
      </div>
    </div>
  )
}
