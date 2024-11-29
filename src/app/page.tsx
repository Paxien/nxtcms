import { Hero } from '@/components/home/Hero'
import { Footer } from '@/components/home/Footer'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <Footer />
    </div>
  )
}
