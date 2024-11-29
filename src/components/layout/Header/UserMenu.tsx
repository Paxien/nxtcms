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
          href="/signup"
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
        <Headless.Menu.Button 
          disabled={isLoading}
          className={classNames(
            "flex items-center space-x-3 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800",
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          <span className="sr-only">Open user menu</span>
          <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
            <span className="text-sm font-semibold text-white">
              {user.username[0].toUpperCase()}
            </span>
          </div>
          <span className="hidden md:inline-block text-sm font-medium text-gray-300">
            {user.username}
          </span>
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
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm text-gray-300">Signed in as</p>
            <p className="text-sm font-medium text-white truncate">{user.username}</p>
          </div>
          {userNavigationItems.map((item) => (
            <Headless.Menu.Item key={item.name}>
              {({ active }) => (
                <Link
                  href={item.href}
                  className={classNames(
                    active ? 'bg-gray-700' : '',
                    'block px-4 py-2 text-sm text-gray-300 hover:text-white'
                  )}
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
                  'block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                onClick={onLogoutAction}
                disabled={isLoading}
              >
                {isLoading ? 'Signing out...' : 'Sign out'}
              </button>
            )}
          </Headless.Menu.Item>
        </Headless.Menu.Items>
      </Headless.Transition>
    </Headless.Menu>
  )
}
