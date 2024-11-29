import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ff',
  description: 'ff page',
}

export default function ffPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">ff</h1>
        <div className="mt-6">
          {/* Add your page content here */}
        </div>
      </div>
    </div>
  )
}