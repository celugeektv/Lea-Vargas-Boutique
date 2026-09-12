import Image from 'next/image'
import Link from 'next/link'
import styles from '../catalogo/catalogo.module.css'
import homeStyles from '../page.module.css'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Layout/Header'

export const dynamic = 'force-dynamic'

export default async function NovedadesPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const resolvedSearchParams = await searchParams

  const categorias = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } }
  })

  // Aquí forzamos que solo traiga novedades
  const whereClause: any = { isActive: true, isNew: true }
  if (resolvedSearchParams.categoria) {
    whereClause.category = { slug: resolvedSearchParams.categoria }
  }

  const productos = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      variants: { include: { inventory: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Header Cliente */}
      <Header />

      <div className={styles.catalogContainer}>
        {/* Sidebar de Filtros */}
        <aside className={styles.filters}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Categorías</h3>
            <div className={styles.filterList}>
              <Link href="/novedades" className={styles.filterOption} style={{ textDecoration: 'none', fontWeight: !resolvedSearchParams.categoria ? 600 : 400, color: !resolvedSearchParams.categoria ? 'var(--color-black)' : 'inherit' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                Todas las novedades
              </Link>
              {categorias.map(cat => (
                <Link 
                  href={`/novedades?categoria=${cat.slug}`} 
                  key={cat.id} 
                  className={styles.filterOption} 
                  style={{ textDecoration: 'none', fontWeight: resolvedSearchParams.categoria === cat.slug ? 600 : 400, color: resolvedSearchParams.categoria === cat.slug ? 'var(--color-black)' : 'inherit' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Grilla de Productos */}
        <section className={styles.productsArea}>
          <div className={styles.activeFilters}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-tertiary)' }}>Mostrando {productos.length} piezas exclusivas</span>
          </div>

          <div className={styles.productGrid}>
            {productos.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-secondary)' }}>
                No hay novedades disponibles en este momento. Vuelve pronto para ver nuestras últimas colecciones.
              </div>
            )}
            {productos.map(producto => (
              <Link href={`/producto/${producto.id}`} key={producto.id} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <Image 
                    src={producto.imageUrl || '/images/hero.jpg'} 
                    alt={producto.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                  />
                  {/* Badge de Nuevo */}
                  <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#000', color: '#fff', fontSize: '0.6rem', fontWeight: 500, padding: '4px 10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Nuevo
                  </span>
                </div>
                <div className={styles.productInfo}>
                  <img src="/logo.png" alt="Lea Vargas Beauty Boutique" style={{ height: '30px' }} />
                  <h3 className={styles.name}>{producto.name}</h3>
                  <span className={styles.price}>
                    ${producto.price.toLocaleString()}
                    {producto.compareAtPrice && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-text-secondary)', marginLeft: '8px', fontSize: '0.85rem' }}>
                        ${producto.compareAtPrice.toLocaleString()}
                      </span>
                    )}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
