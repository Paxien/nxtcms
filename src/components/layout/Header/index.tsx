'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '@/store/useAuthStore'
import { UserMenu } from './UserMenu'
import { MobileMenu } from './MobileMenu'

interface NavigationItem {
  name: string
  path: string
  showInHeader: boolean
  access?: 'public' | 'protected'
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuthStore()

  useEffect(() => {
    loadNavigation()
  }, [pathname]) // Reload when pathname changes

  const loadNavigation = async () => {
    try {
      const response = await fetch('/api/navigation', {
        cache: 'no-store', // Disable caching
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setNavigationItems(data.headerLinks)
      }
    } catch (error) {
      console.error('Failed to load navigation:', error)
    }
  }

  const handleLogoutAction = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const handleCloseMenuAction = () => {
    setMobileMenuOpen(false)
  }

  const visibleItems = navigationItems.filter(item => {
    if (!item.showInHeader) return false
    if (item.access === 'protected' && !user) return false
    return true
  })

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">My App</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center md:space-x-8">
            {visibleItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={classNames(
                  pathname === item.path
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white',
                  'text-sm font-medium transition-colors duration-200'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section: Search, Auth, and User Menu */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  placeholder="Search..."
                  className="block w-full rounded-md border-0 bg-gray-800 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Auth Navigation */}
            {user ? (
              <>
                {/* Profile Link */}
                <Link
                  href="/profile"
                  className={classNames(
                    pathname === '/profile'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                    'hidden md:block rounded-md px-3 py-2 text-sm font-medium'
                  )}
                >
                  Profile
                </Link>
                {/* User Menu (Desktop) */}
                <div className="hidden md:block">
                  <UserMenu 
                    user={user} 
                    onLogoutAction={handleLogoutAction}
                    isLoading={isLoading}
                  />
                </div>
              </>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-4">
                <Link
                  href="/login"
                  className={classNames(
                    pathname === '/login'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium'
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className={classNames(
                    pathname === '/signup'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600',
                    'rounded-md px-3 py-2 text-sm font-medium'
                  )}
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400 hover:text-gray-300"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onCloseAction={handleCloseMenuAction}
        navigation={visibleItems}
        user={user}
        onLogoutAction={handleLogoutAction}
      />
    </header>
  )
}
