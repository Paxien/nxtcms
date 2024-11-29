import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const { name, path: pagePath, folder, access, showInHeader } = await req.json()

    // Base directory for pages - now under a dedicated pages directory
    const pagesDir = path.join(process.cwd(), 'src/app/pages')

    // Create the full directory path
    const fullDirPath = folder 
      ? path.join(pagesDir, ...folder.split('/'))
      : pagesDir

    // Create base pages directory if it doesn't exist
    fs.mkdirSync(pagesDir, { recursive: true })

    // Create folder structure if it doesn't exist
    if (folder) {
      fs.mkdirSync(fullDirPath, { recursive: true })
    }

    // Create the page file
    const pageFileName = pagePath.split('/').pop() || 'index'
    const pageFilePath = path.join(fullDirPath, `${pageFileName}/page.tsx`)

    // Ensure the page directory exists
    fs.mkdirSync(path.dirname(pageFilePath), { recursive: true })

    // Create basic page content with layout and metadata
    const pageContent = `import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${name}',
  description: '${name} page',
}

export default function ${name.replace(/\s+/g, '')}Page() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">${name}</h1>
        <div className="mt-6">
          {/* Add your page content here */}
        </div>
      </div>
    </div>
  )
}`

    // Write the file
    fs.writeFileSync(pageFilePath, pageContent)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}
