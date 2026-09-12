import type { Metadata } from 'next'
import { Inter, Playfair_Display, Bodoni_Moda, Great_Vibes, Montserrat } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-modern',
  weight: ['200', '300', '400', '500'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  style: ['normal', 'italic'],
})

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-brand',
  style: ['normal', 'italic'],
})

const signature = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-signature',
})

export const metadata: Metadata = {
  title: 'Lea Vargas Beauty Boutique',
  description: 'Descubre nuestra última colección de ropa con diseños exclusivos y calidad premium.',
}

import ClientFooter from '@/components/Layout/ClientFooter'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable} ${playfair.variable} ${bodoni.variable} ${signature.variable}`}>
      <body>
        {children}
        <ClientFooter />
      </body>
    </html>
  )
}
