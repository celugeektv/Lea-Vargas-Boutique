import Link from 'next/link'
import styles from '../../../admin.module.css'
import { getCategories } from '@/actions/categorias'
import ProductForm from '@/components/Admin/ProductForm'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        include: { inventory: true }
      }
    }
  })

  if (!product) {
    notFound()
  }

  const categories = await getCategories()

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Editar Producto</h1>
        <Link href="/admin/productos" className="btn btn-secondary">
          Volver al Catálogo
        </Link>
      </div>

      <ProductForm categories={categories} initialData={product} />
    </div>
  )
}
