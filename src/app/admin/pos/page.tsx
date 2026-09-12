import { getPOSProducts } from '@/actions/pos'
import POSClient from './POSClient'

export const dynamic = 'force-dynamic'

export default async function POSPage() {
  const products = await getPOSProducts()
  
  return <POSClient initialProducts={products} />
}
