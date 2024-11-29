'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Page {
  name: string
  path: string
  showInHeader: boolean
  access?: 'public' | 'protected'
}

interface PageFormData {
  name: string
  path: string
  access: 'public' | 'protected'
  showInHeader: boolean
}

const defaultPageForm: PageFormData = {
  name: '',
  path: '',
  access: 'public',
  showInHeader: true
}

export default function Pages() {
  const [pages, setPages] = useState<Page[]>([])
  const [message, setMessage] = useState<string>('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [pageForm, setPageForm] = useState<PageFormData>(defaultPageForm)

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = () => {
    fetch('/api/navigation')
      .then((res) => res.json())
      .then((data) => setPages(data.headerLinks))
      .catch((error) => console.error('Error loading navigation:', error))
  }

  const handleFormSubmit = async () => {
    if (!pageForm.name || !pageForm.path) {
      setMessage('Please fill in all required fields')
      return
    }

    // Ensure path starts with /
    const path = pageForm.path.startsWith('/') ? pageForm.path : `/${pageForm.path}`
    
    // Check for duplicate paths (except when editing the same page)
    if (!editingPage && pages.some(page => page.path === path)) {
      setMessage('A page with this path already exists')
      return
    }

    let updatedPages: Page[]
    if (editingPage) {
      // Update existing page
      updatedPages = pages.map(page => 
        page.path === editingPage ? { ...pageForm, path } : page
      )
    } else {
      // Add new page
      updatedPages = [...pages, { ...pageForm, path }]
    }

    await updatePages(updatedPages)
    setIsFormOpen(false)
    setEditingPage(null)
    setPageForm(defaultPageForm)
  }

  const handleEditPage = (page: Page) => {
    setPageForm({
      name: page.name,
      path: page.path,
      access: page.access || 'public',
      showInHeader: page.showInHeader
    })
    setEditingPage(page.path)
    setIsFormOpen(true)
  }

  const handleDeletePage = async (pagePath: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      const updatedPages = pages.filter(page => page.path !== pagePath)
      await updatePages(updatedPages)
    }
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
        
        // Force revalidation of navigation data
        await fetch('/api/navigation', {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('Failed to update navigation')
      }
    } catch (error) {
      setMessage('Failed to update navigation')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Site Pages</h1>
            <p className="mt-2 text-gray-400">Manage your site's pages and navigation.</p>
          </div>
          <button
            onClick={() => {
              setIsFormOpen(true)
              setEditingPage(null)
              setPageForm(defaultPageForm)
            }}
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

        {/* Page Form */}
        {isFormOpen && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {editingPage ? 'Edit Page' : 'Add New Page'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false)
                  setEditingPage(null)
                  setPageForm(defaultPageForm)
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
                  value={pageForm.name}
                  onChange={(e) => setPageForm({ ...pageForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                  placeholder="Home"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Path</label>
                <input
                  type="text"
                  value={pageForm.path}
                  onChange={(e) => setPageForm({ ...pageForm, path: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                  placeholder="/home"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Access Level</label>
                <select
                  value={pageForm.access}
                  onChange={(e) => setPageForm({ ...pageForm, access: e.target.value as 'public' | 'protected' })}
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
                  checked={pageForm.showInHeader}
                  onChange={(e) => setPageForm({ ...pageForm, showInHeader: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="showInHeader" className="text-gray-300">
                  Show in Header
                </label>
              </div>
              <button
                onClick={handleFormSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingPage ? 'Update Page' : 'Add Page'}
              </button>
            </div>
          </div>
        )}

        {/* Pages Table */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8 border border-gray-700">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-700 text-gray-200 font-medium">
            <span>Page Name</span>
            <span>Path</span>
            <span>Access</span>
            <span>Show in Header</span>
            <span>Actions</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700">
            {pages.map((page) => (
              <div
                key={page.path}
                className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-white font-medium">{page.name}</span>
                <span className="text-gray-400 font-mono text-sm">{page.path}</span>
                <span className={`inline-flex px-3 py-1 text-sm rounded-full font-medium ${
                  page.access === 'protected'
                    ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                    : 'bg-green-900/50 text-green-400 border border-green-700'
                }`}>
                  {page.access || 'public'}
                </span>
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={page.showInHeader}
                      onChange={() => {
                        const updatedPages = pages.map((p) =>
                          p.path === page.path
                            ? { ...p, showInHeader: !p.showInHeader }
                            : p
                        )
                        updatePages(updatedPages)
                      }}
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
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPage(page)}
                    className="px-3 py-1 text-sm bg-blue-600/50 text-blue-300 border border-blue-700 rounded hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePage(page.path)}
                    className="px-3 py-1 text-sm bg-red-900/50 text-red-300 border border-red-700 rounded hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
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
