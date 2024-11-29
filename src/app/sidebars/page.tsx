'use client'

import { useState, useEffect } from 'react'
import * as Icons from '@heroicons/react/24/outline'

interface SidebarItem {
  name: string
  path: string
  icon: keyof typeof Icons
  access: 'public' | 'protected'
  showInSidebar: boolean
}

interface SidebarConfig {
  enabled: boolean
  items: SidebarItem[]
}

interface SidebarsConfig {
  leftSidebar: SidebarConfig
  rightSidebar: SidebarConfig
}

const defaultItem: SidebarItem = {
  name: '',
  path: '',
  icon: 'HomeIcon',
  access: 'public',
  showInSidebar: true,
}

export default function SidebarSettings() {
  const [config, setConfig] = useState<SidebarsConfig | null>(null)
  const [message, setMessage] = useState('')
  const [editingItem, setEditingItem] = useState<{
    side: 'left' | 'right'
    index: number | null
  } | null>(null)
  const [itemForm, setItemForm] = useState<SidebarItem>(defaultItem)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/sidebars')
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error('Error loading sidebars config:', error)
      setMessage('Failed to load sidebars configuration')
    }
  }

  const updateConfig = async (newConfig: SidebarsConfig) => {
    try {
      const response = await fetch('/api/sidebars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      })

      if (response.ok) {
        setConfig(newConfig)
        setMessage('Sidebars configuration updated successfully')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('Failed to update sidebars')
      }
    } catch (error) {
      setMessage('Failed to update sidebars configuration')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleToggleSidebar = (side: 'left' | 'right') => {
    if (!config) return

    const newConfig = {
      ...config,
      [side === 'left' ? 'leftSidebar' : 'rightSidebar']: {
        ...config[side === 'left' ? 'leftSidebar' : 'rightSidebar'],
        enabled: !config[side === 'left' ? 'leftSidebar' : 'rightSidebar'].enabled,
      },
    }

    updateConfig(newConfig)
  }

  const handleEditItem = (side: 'left' | 'right', index: number) => {
    if (!config) return

    const items = config[side === 'left' ? 'leftSidebar' : 'rightSidebar'].items
    setItemForm(items[index])
    setEditingItem({ side, index })
  }

  const handleDeleteItem = (side: 'left' | 'right', index: number) => {
    if (!config) return

    const newConfig = { ...config }
    const items = [...newConfig[side === 'left' ? 'leftSidebar' : 'rightSidebar'].items]
    items.splice(index, 1)
    newConfig[side === 'left' ? 'leftSidebar' : 'rightSidebar'].items = items

    updateConfig(newConfig)
  }

  const handleSubmitItem = () => {
    if (!config || !editingItem) return

    const newConfig = { ...config }
    const items = [...newConfig[editingItem.side === 'left' ? 'leftSidebar' : 'rightSidebar'].items]

    if (editingItem.index !== null) {
      items[editingItem.index] = itemForm
    } else {
      items.push(itemForm)
    }

    newConfig[editingItem.side === 'left' ? 'leftSidebar' : 'rightSidebar'].items = items
    updateConfig(newConfig)
    setEditingItem(null)
    setItemForm(defaultItem)
  }

  if (!config) return null

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Sidebar Settings</h1>
          <p className="mt-2 text-gray-400">Manage your site's sidebar navigation.</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md mb-6 ${
              message.includes('success')
                ? 'bg-green-900/50 text-green-400 border border-green-700'
                : 'bg-red-900/50 text-red-400 border border-red-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Left Sidebar Settings */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Left Sidebar</h2>
            <button
              onClick={() => handleToggleSidebar('left')}
              className={`px-4 py-2 rounded-md transition-colors ${
                config.leftSidebar.enabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {config.leftSidebar.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <button
            onClick={() => {
              setEditingItem({ side: 'left', index: null })
              setItemForm(defaultItem)
            }}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Item
          </button>

          <div className="space-y-4">
            {config.leftSidebar.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.path}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditItem('left', index)}
                    className="px-3 py-1 bg-blue-600/50 text-blue-300 rounded hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem('left', index)}
                    className="px-3 py-1 bg-red-900/50 text-red-300 rounded hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Settings */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Right Sidebar</h2>
            <button
              onClick={() => handleToggleSidebar('right')}
              className={`px-4 py-2 rounded-md transition-colors ${
                config.rightSidebar.enabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {config.rightSidebar.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <button
            onClick={() => {
              setEditingItem({ side: 'right', index: null })
              setItemForm(defaultItem)
            }}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Item
          </button>

          <div className="space-y-4">
            {config.rightSidebar.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.path}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditItem('right', index)}
                    className="px-3 py-1 bg-blue-600/50 text-blue-300 rounded hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem('right', index)}
                    className="px-3 py-1 bg-red-900/50 text-red-300 rounded hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Item Form */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-white mb-4">
                {editingItem.index !== null ? 'Edit Item' : 'Add Item'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Path</label>
                  <input
                    type="text"
                    value={itemForm.path}
                    onChange={(e) => setItemForm({ ...itemForm, path: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Icon</label>
                  <select
                    value={itemForm.icon}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, icon: e.target.value as keyof typeof Icons })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    {Object.keys(Icons).map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Access Level</label>
                  <select
                    value={itemForm.access}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, access: e.target.value as 'public' | 'protected' })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="public">Public</option>
                    <option value="protected">Protected</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showInSidebar"
                    checked={itemForm.showInSidebar}
                    onChange={(e) => setItemForm({ ...itemForm, showInSidebar: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="showInSidebar" className="text-gray-300">
                    Show in Sidebar
                  </label>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => {
                      setEditingItem(null)
                      setItemForm(defaultItem)
                    }}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingItem.index !== null ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
