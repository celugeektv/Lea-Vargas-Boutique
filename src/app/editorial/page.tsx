'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './editorial.module.css'
import homeStyles from '../page.module.css'
import Header from '@/components/Layout/Header'

export default function EditorialPage() {
  return (
    <main className={styles.editorialContainer} style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Header transparent />

      {/* Hero Editorial */}
      <section className={styles.heroSection}>
        <Image 
          src="/products/conjunto-1.jpeg" 
          alt="Campaña Verano" 
          fill 
          priority 
          style={{ objectFit: 'cover', objectPosition: 'top' }} 
        />
        <div className={styles.heroOverlay} style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1))' }}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle} style={{ fontFamily: 'serif', fontSize: '3.5rem' }}>Brisa de Verano</h1>
          <span className={styles.heroSubtitle} style={{ letterSpacing: '3px', textTransform: 'uppercase' }}>Colección Enterizos y Conjuntos 2026</span>
        </div>
      </section>

      {/* Frase Editorial */}
      <section className={styles.textSection}>
        <p style={{ fontFamily: 'serif', fontSize: '2rem', fontStyle: 'italic', color: '#1e293b' }}>
          "Redefinimos la frescura para la mujer contemporánea. Siluetas ligeras, conjuntos versátiles y una paleta que acompaña tus días de sol."
        </p>
      </section>

      {/* Grid de imágenes */}
      <section className={styles.imageGrid}>
        <div className={styles.gridImage}>
          <Image src="/products/vestido-corto-1.jpeg" alt="Vestidos Cortos" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', objectPosition: 'top' }} />
        </div>
        <div className={styles.gridImage} style={{ marginTop: '6rem' }}>
          <Image src="/products/enterizo-3.jpeg" alt="Enterizos de Verano" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', objectPosition: 'top' }} />
        </div>
      </section>

      {/* Frase Intermedia */}
      <section className={styles.textSection} style={{ padding: '4rem 2rem' }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto', textAlign: 'center', lineHeight: 1.8 }}>
          Nuestra nueva línea está diseñada pensando en la transición perfecta entre el día y la noche. Desde el lino hasta los estampados florales, cada prenda cuenta una historia de libertad y elegancia.
        </p>
      </section>

      {/* Imagen a lo ancho */}
      <section className={styles.fullWidthImage} style={{ height: '70vh', position: 'relative' }}>
        <Image src="/products/conjunto-2.jpeg" alt="Elegancia Sastre" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'top' }} />
      </section>

      {/* Cierre */}
      <section className={styles.textSection} style={{ marginTop: '0', padding: '6rem 2rem', backgroundColor: '#fff' }}>
        <p style={{ fontSize: '1.25rem', fontFamily: 'sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0f172a' }}>Descubre tu nuevo estilo</p>
        <Link href="/catalogo" className="btn btn-primary" style={{ marginTop: '2rem', padding: '1rem 3rem', fontSize: '1.1rem' }}>
          Explorar Colección
        </Link>
      </section>

    </main>
  )
}
