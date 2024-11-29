'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Page {
  name: string
  path: string
  access: string
  showInHeader: boolean
}

export default function Pages() {
  const [pages, setPages] = useState<Page[]>([])
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    fetch('/api/navigation')
      .then((res) => res.json())
      .then((data) => setPages(data.headerLinks))
      .catch((error) => console.error('Error loading navigation:', error))
  }, [])

  const toggleHeaderVisibility = async (pagePath: string) => {
    const updatedPages = pages.map((page) =>
      page.path === pagePath
        ? { ...page, showInHeader: !page.showInHeader }
        : page
    )
    setPages(updatedPages)

    try {
      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headerLinks: updatedPages }),
      })

      if (response.ok) {
        setMessage('Header navigation updated successfully')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('Failed to update navigation')
      }
    } catch (error) {
      setMessage('Failed to update header navigation')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Site Pages</h1>
          <p className="mt-2 text-gray-400">Manage which pages appear in your site's navigation.</p>
        </div>
        
        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded-md mb-6 border ${
            message.includes('success')
              ? 'bg-green-900/50 text-green-400 border-green-700'
              : 'bg-red-900/50 text-red-400 border-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Pages Table */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8 border border-gray-700">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-700 text-gray-200 font-medium">
            <span>Page Name</span>
            <span>Path</span>
            <span>Access</span>
            <span>Show in Header</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700">
            {pages.map((page) => (
              <div
                key={page.path}
                className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-white font-medium">{page.name}</span>
                <span className="text-gray-400 font-mono text-sm">{page.path}</span>
                <span className={`inline-flex px-3 py-1 text-sm rounded-full font-medium ${
                  page.access === 'protected'
                    ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                    : 'bg-green-900/50 text-green-400 border border-green-700'
                }`}>
                  {page.access}
                </span>
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={page.showInHeader}
                      onChange={() => toggleHeaderVisibility(page.path)}
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer 
                      peer-focus:ring-4 peer-focus:ring-blue-800 
                      peer-checked:after:translate-x-full peer-checked:bg-blue-600
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-gray-200 after:rounded-full after:h-5 after:w-5 
                      after:transition-all after:border-gray-600 after:border">
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Navigation Preview */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Current Header Navigation
          </h2>
          <div className="flex gap-3 flex-wrap">
            {pages
              .filter((page) => page.showInHeader)
              .map((page) => (
                <div
                  key={page.path}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md border border-gray-600 shadow-md"
                >
                  {page.name}
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}
