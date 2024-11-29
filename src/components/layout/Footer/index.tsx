export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} My App. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://twitter.com"
              className="text-gray-400 hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://github.com"
              className="text-gray-400 hover:text-gray-300"
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
