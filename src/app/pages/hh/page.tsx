import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'hh',
  description: 'hh page',
}

export default function hhPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">hh</h1>
        <div className="mt-6">
          {/* Add your page content here */}
        </div>
      </div>
    </div>
  )
}