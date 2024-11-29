'use client'

import Link from 'next/link'

const pages = [
  { name: 'Home', path: '/', access: 'public' },
  { name: 'Login', path: '/login', access: 'public' },
  { name: 'Sign Up', path: '/signup', access: 'public' },
  { name: 'Profile', path: '/profile', access: 'protected' },
  { name: 'Contact', path: '/contact', access: 'public' },
]

export default function Pages() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Site Pages</h1>
      <div className="grid gap-4">
        {pages.map((page) => (
          <div 
            key={page.path}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <Link 
              href={page.path}
              className="flex items-center justify-between"
            >
              <span className="text-lg">{page.name}</span>
              <span className={`px-2 py-1 text-sm rounded ${
                page.access === 'protected' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {page.access}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
