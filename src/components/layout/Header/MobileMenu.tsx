'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { navigationItems } from './constants'
import { NavigationItem } from './types'

interface MobileMenuProps {
  isOpen: boolean
  onCloseAction: () => void
  navigation: NavigationItem[]
  user: { username: string } | null
  onLogoutAction: () => Promise<void>
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function MobileMenu({
  isOpen,
  onCloseAction,
  navigation,
  user,
  onLogoutAction,
}: MobileMenuProps) {
  const pathname = usePathname()

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 md:hidden" onClose={onCloseAction}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-900 px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white" onClick={onCloseAction}>
              My App
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
              onClick={onCloseAction}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-700">
              <div className="space-y-2 py-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                      '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold'
                    )}
                    onClick={onCloseAction}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className={classNames(
                        pathname === '/profile'
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                        '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold'
                      )}
                      onClick={onCloseAction}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          await onLogoutAction()
                          onCloseAction()
                        } catch (error) {
                          console.error('Logout failed:', error instanceof Error ? error.message : 'Unknown error')
                        }
                      }}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={classNames(
                        pathname === '/login'
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                        '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold'
                      )}
                      onClick={onCloseAction}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className={classNames(
                        pathname === '/signup'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600',
                        '-mx-3 mt-2 block rounded-lg px-3 py-2 text-base font-semibold'
                      )}
                      onClick={onCloseAction}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
