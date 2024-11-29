export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavigationItem[]
}

export interface UserMenuProps {
  user: {
    username: string
    role: string
  } | null
  onLogout: () => void
}

export interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigation: NavigationItem[]
  user: UserMenuProps['user']
  onLogout: () => void
}
