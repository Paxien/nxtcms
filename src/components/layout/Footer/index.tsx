export function Footer() {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
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
              Twitter
            </a>
            <a
              href="https://github.com"
              className="text-gray-400 hover:text-gray-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
