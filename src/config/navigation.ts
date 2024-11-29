import { Route } from '@/types/common'
import { ROUTES } from '@/constants/app'

export const mainNavigation: Route[] = [
  {
    path: ROUTES.HOME,
    name: 'Home',
  },
  {
    path: ROUTES.DASHBOARD,
    name: 'Dashboard',
  },
  {
    path: ROUTES.PROFILE,
    name: 'Profile',
  },
  {
    path: ROUTES.SETTINGS,
    name: 'Settings',
  },
]

export const footerNavigation: Route[] = [
  {
    path: '/privacy',
    name: 'Privacy Policy',
  },
  {
    path: '/terms',
    name: 'Terms of Service',
  },
  {
    path: '/contact',
    name: 'Contact Us',
  },
]
