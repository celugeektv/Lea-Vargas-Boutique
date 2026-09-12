import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductClientView from '@/components/Product/ProductClientView'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: { include: { inventory: true } }
    }
  })

  if (!product || !product.isActive) {
    notFound()
  }

  return <ProductClientView product={product} />
}
