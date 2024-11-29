import { APP_NAME, APP_DESCRIPTION } from '@/constants/app'

export const siteConfig = {
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_APP_URL,
  ogImage: 'https://your-domain.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/your-handle',
    github: 'https://github.com/your-repo',
  },
  creator: 'Your Name',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
} as const

export type SiteConfig = typeof siteConfig
