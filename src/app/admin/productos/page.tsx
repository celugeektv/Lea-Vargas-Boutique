import Link from 'next/link'
import styles from '../admin.module.css'
import { getProducts } from '@/actions/productos'
import { getCategories } from '@/actions/categorias'
import DeleteProductBtn from '@/components/Admin/DeleteProductBtn'
import ProductSearch from '@/components/Admin/ProductSearch'

export default async function ProductosPage({ searchParams }: { searchParams: Promise<{ q?: string, category?: string }> }) {
  const params = await searchParams
  const q = params.q || ''
  const categoryId = params.category || ''
  
  const productos = await getProducts(q, categoryId)
  const categories = await getCategories()

  return (
    <div>
      <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
          <h1 className={styles.pageTitle} style={{ margin: 0 }}>Catálogo</h1>
          <ProductSearch categories={categories} />
        </div>
        <Link href="/admin/productos/nuevo" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
          + Agregar Producto
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Inventario Actual</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No hay productos registrados.</td>
              </tr>
            )}
            {productos.map(prod => {
              // Calcular stock total sumando todas las variantes
              const totalStock = prod.variants.reduce((acc, v) => acc + (v.inventory?.quantity || 0), 0)
              const hasLowStock = prod.variants.some(v => (v.inventory?.quantity || 0) > 0 && (v.inventory?.quantity || 0) <= (v.inventory?.lowStockThreshold || 5))
              
              let status = 'Activo'
              if (!prod.isActive) status = 'Inactivo'
              else if (totalStock === 0) status = 'Agotado'
              else if (hasLowStock) status = 'Bajo Stock'

              return (
                <tr key={prod.id}>
                  <td><strong style={{ color: '#09090b' }}>{prod.name}</strong></td>
                  <td style={{ color: '#71717a', fontFamily: 'monospace' }}>
                    {prod.variants.length > 0 ? `${prod.variants[0].sku} (+${prod.variants.length - 1})` : 'Sin SKU'}
                  </td>
                  <td>${prod.price.toLocaleString()}</td>
                  <td>{prod.category?.name}</td>
                  <td>{totalStock} un.</td>
                  <td>
                    <span className={`${styles.badge} ${
                      status === 'Activo' ? styles['badge-paid'] : 
                      status === 'Bajo Stock' ? styles['badge-pending'] : ''
                    }`} style={status === 'Agotado' ? { backgroundColor: '#fee2e2', color: '#991b1b' } : {}}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/productos/${prod.id}/editar`} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>Editar</Link>
                    <DeleteProductBtn productId={prod.id} productName={prod.name} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
