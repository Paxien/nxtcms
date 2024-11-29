'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import * as Headless from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { userNavigationItems } from './constants'

interface UserMenuProps {
  user: {
    username: string
    role: string
  } | null
  onLogoutAction: () => Promise<void>
  isLoading?: boolean
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function UserMenu({ user, onLogoutAction, isLoading }: UserMenuProps) {
  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-300 hover:text-white"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Sign up
        </Link>
      </div>
    )
  }

  return (
    <Headless.Menu as="div" className="relative ml-3">
      <div>
        <Headless.Menu.Button className="flex items-center space-x-3 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="sr-only">Open user menu</span>
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user.username[0].toUpperCase()}
            </span>
          </div>
        </Headless.Menu.Button>
      </div>
      <Headless.Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Headless.Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {userNavigationItems.map((item) => (
            <Headless.Menu.Item key={item.href}>
              {({ active }) => (
                <Link
                  href={item.href}
                  className={`${
                    active ? 'bg-gray-700' : ''
                  } block px-4 py-2 text-sm text-gray-300 hover:text-white`}
                >
                  {item.label}
                </Link>
              )}
            </Headless.Menu.Item>
          ))}
          <Headless.Menu.Item>
            {({ active }) => (
              <button
                className={classNames(
                  active ? 'bg-gray-700' : '',
                  'relative w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                onClick={onLogoutAction}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Logging out...</span>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></div>
                    </div>
                  </>
                ) : (
                  'Sign out'
                )}
              </button>
            )}
          </Headless.Menu.Item>
        </Headless.Menu.Items>
      </Headless.Transition>
    </Headless.Menu>
  )
}
