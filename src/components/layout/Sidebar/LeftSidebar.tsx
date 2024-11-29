'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
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

export default function LeftSidebar() {
  const [sidebarConfig, setSidebarConfig] = useState<SidebarConfig | null>(null)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetch('/api/sidebars')
      .then((res) => res.json())
      .then((data) => setSidebarConfig(data.leftSidebar))
      .catch((error) => console.error('Error loading left sidebar:', error))
  }, [])

  if (!sidebarConfig?.enabled) return null

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 pt-16">
      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {sidebarConfig.items
            .filter(
              (item) =>
                item.showInSidebar &&
                (item.access === 'public' || (item.access === 'protected' && isAuthenticated))
            )
            .map((item) => {
              const Icon = Icons[item.icon]
              const isActive = pathname === item.path

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5 mr-3" />}
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
        </ul>
      </nav>
    </aside>
  )
}
