import Link from 'next/link'
import styles from '../../admin.module.css'
import { getCategories } from '@/actions/categorias'
import ProductForm from '@/components/Admin/ProductForm'

export default async function NuevoProductoPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Agregar Nuevo Producto</h1>
        <Link href="/admin/productos" className="btn btn-secondary">
          Cancelar
        </Link>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
