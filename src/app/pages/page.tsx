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
  folder: string 
}

const defaultPageForm: PageFormData = {
  name: '',
  path: '',
  access: 'public',
  showInHeader: true,
  folder: '' 
}

export default function Pages() {
  const [pages, setPages] = useState<Page[]>([])
  const [message, setMessage] = useState<string>('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [pageForm, setPageForm] = useState<PageFormData>(defaultPageForm)
  const [folders, setFolders] = useState<string[]>([]) 

  useEffect(() => {
    loadPages()
  }, [])

  useEffect(() => {
    loadFolders()
  }, [pages])

  const loadPages = () => {
    fetch('/api/navigation')
      .then((res) => res.json())
      .then((data) => setPages(data.headerLinks))
      .catch((error) => console.error('Error loading navigation:', error))
  }

  const loadFolders = () => {
    const uniqueFolders = new Set(
      pages
        .map(page => {
          const pathParts = page.path.split('/')
          return pathParts.length > 2 ? pathParts.slice(1, -1).join('/') : ''
        })
        .filter(Boolean)
    )
    setFolders(Array.from(uniqueFolders))
  }

  const handleFormSubmit = async () => {
    if (!pageForm.name || !pageForm.path) {
      setMessage('Please fill in all required fields')
      return
    }

    let fullPath = pageForm.path
    if (pageForm.folder) {
      const formattedFolder = pageForm.folder
        .split('/')
        .filter(Boolean)
        .join('/')
      fullPath = `/${formattedFolder}/${pageForm.path.replace(/^\/+/, '')}`
    } else {
      fullPath = fullPath.startsWith('/') ? fullPath : `/${fullPath}`
    }
    
    if (!editingPage && pages.some(page => page.path === fullPath)) {
      setMessage('A page with this path already exists')
      return
    }

    // Create the page file and folder structure
    try {
      const response = await fetch('/api/pages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: pageForm.name,
          path: fullPath,
          folder: pageForm.folder,
          access: pageForm.access,
          showInHeader: pageForm.showInHeader,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create page file')
      }

      let updatedPages: Page[]
      if (editingPage) {
        updatedPages = pages.map(page => 
          page.path === editingPage ? { ...pageForm, path: fullPath } : page
        )
      } else {
        updatedPages = [...pages, { ...pageForm, path: fullPath }]
      }

      await updatePages(updatedPages)
      setIsFormOpen(false)
      setEditingPage(null)
      setPageForm(defaultPageForm)
    } catch (error) {
      console.error('Error creating page:', error)
      setMessage('Failed to create page file and folder structure')
    }
  }

  const handleEditPage = (page: Page) => {
    const pathParts = page.path.split('/')
    const pagePath = pathParts.pop() || '' 
    const folder = pathParts.slice(1).join('/') 

    setPageForm({
      name: page.name,
      path: pagePath,
      folder: folder,
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
        
        {message && (
          <div className={`p-4 rounded-md mb-6 border ${
            message.includes('success')
              ? 'bg-green-900/50 text-green-400 border-green-700'
              : 'bg-red-900/50 text-red-400 border-red-700'
          }`}>
            {message}
          </div>
        )}

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
                <label className="block text-gray-300 mb-2">Folder (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={pageForm.folder}
                    onChange={(e) => setPageForm({ ...pageForm, folder: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                    placeholder="admin/settings"
                    list="folders"
                  />
                  <datalist id="folders">
                    {folders.map((folder, index) => (
                      <option key={index} value={folder} />
                    ))}
                  </datalist>
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  Example: "admin/settings" for /admin/settings/your-page
                </p>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Page Path</label>
                <input
                  type="text"
                  value={pageForm.path}
                  onChange={(e) => setPageForm({ ...pageForm, path: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                  placeholder="footer"
                />
                <p className="mt-1 text-sm text-gray-400">
                  {pageForm.folder 
                    ? `Full path will be: /${pageForm.folder}/${pageForm.path.replace(/^\/+/, '')}`
                    : 'Enter path without leading slash'}
                </p>
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
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showInHeader" className="ml-2 text-gray-300">
                  Show in Header Navigation
                </label>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleFormSubmit}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingPage ? 'Update Page' : 'Create Page'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pages Table */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8 border border-gray-700">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-700 text-gray-200 font-medium">
            <span>Page Name</span>
            <span>Folder</span>
            <span>Path</span>
            <span>Access</span>
            <span>Show in Header</span>
            <span>Actions</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700">
            {pages.map((page) => {
              const pathParts = page.path.split('/')
              const folder = pathParts.length > 2 ? pathParts.slice(1, -1).join('/') : ''
              return (
                <div
                  key={page.path}
                  className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-white font-medium">{page.name}</span>
                  <span className="text-gray-400 font-mono text-sm">
                    {folder ? `/${folder}` : '(root)'}
                  </span>
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
              )
            })}
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
