'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Page {
  name: string
  path: string
  access: string
  showInHeader: boolean
}

interface NewPage {
  name: string
  path: string
  access: 'public' | 'protected'
  showInHeader: boolean
}

const defaultNewPage: NewPage = {
  name: '',
  path: '',
  access: 'public',
  showInHeader: true
}

export default function Pages() {
  const [pages, setPages] = useState<Page[]>([])
  const [message, setMessage] = useState<string>('')
  const [isAddingPage, setIsAddingPage] = useState(false)
  const [newPage, setNewPage] = useState<NewPage>(defaultNewPage)

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = () => {
    fetch('/api/navigation')
      .then((res) => res.json())
      .then((data) => setPages(data.headerLinks))
      .catch((error) => console.error('Error loading navigation:', error))
  }

  const toggleHeaderVisibility = async (pagePath: string) => {
    const updatedPages = pages.map((page) =>
      page.path === pagePath
        ? { ...page, showInHeader: !page.showInHeader }
        : page
    )
    await updatePages(updatedPages)
  }

  const updatePages = async (updatedPages: Page[]) => {
    try {
      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headerLinks: updatedPages }),
      })

      if (response.ok) {
        setPages(updatedPages)
        setMessage('Navigation updated successfully')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('Failed to update navigation')
      }
    } catch (error) {
      setMessage('Failed to update navigation')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleAddPage = async () => {
    if (!newPage.name || !newPage.path) {
      setMessage('Please fill in all required fields')
      return
    }

    // Ensure path starts with /
    const path = newPage.path.startsWith('/') ? newPage.path : `/${newPage.path}`
    
    // Check for duplicate paths
    if (pages.some(page => page.path === path)) {
      setMessage('A page with this path already exists')
      return
    }

    const updatedPages = [...pages, { ...newPage, path }]
    await updatePages(updatedPages)
    setIsAddingPage(false)
    setNewPage(defaultNewPage)
  }

  return (
    <main className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Site Pages</h1>
            <p className="mt-2 text-gray-400">Manage which pages appear in your site's navigation.</p>
          </div>
          <button
            onClick={() => setIsAddingPage(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Page
          </button>
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

        {/* Add New Page Form */}
        {isAddingPage && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Add New Page</h2>
              <button
                onClick={() => {
                  setIsAddingPage(false)
                  setNewPage(defaultNewPage)
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Page Name</label>
                <input
                  type="text"
                  value={newPage.name}
                  onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                  placeholder="Home"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Path</label>
                <input
                  type="text"
                  value={newPage.path}
                  onChange={(e) => setNewPage({ ...newPage, path: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                  placeholder="/home"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Access Level</label>
                <select
                  value={newPage.access}
                  onChange={(e) => setNewPage({ ...newPage, access: e.target.value as 'public' | 'protected' })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="protected">Protected</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showInHeader"
                  checked={newPage.showInHeader}
                  onChange={(e) => setNewPage({ ...newPage, showInHeader: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="showInHeader" className="text-gray-300">
                  Show in Header
                </label>
              </div>
              <button
                onClick={handleAddPage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Page
              </button>
            </div>
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
