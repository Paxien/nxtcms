import { GithubIcon, TwitterIcon } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-auto bg-gray-900/50 backdrop-blur-sm">
      <div className="py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-between items-center w-full">
            <p className="text-sm text-gray-400">
              {new Date().getFullYear()} My App. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-gray-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                className="text-gray-400 hover:text-gray-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Built with{' '}
            <a href="https://nextjs.org" className="text-gray-300 hover:text-white transition-colors">Next.js</a>,{' '}
            <a href="https://www.typescriptlang.org" className="text-gray-300 hover:text-white transition-colors">TypeScript</a>,{' '}
            and{' '}
            <a href="https://tailwindcss.com" className="text-gray-300 hover:text-white transition-colors">Tailwind CSS</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
