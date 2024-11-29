import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/config/sidebars.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading sidebars config:', error)
    return NextResponse.json({ error: 'Failed to load sidebars configuration' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'src/config/sidebars.json')
    const data = await request.json()
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ message: 'Sidebars configuration updated successfully' })
  } catch (error) {
    console.error('Error updating sidebars config:', error)
    return NextResponse.json({ error: 'Failed to update sidebars configuration' }, { status: 500 })
  }
}
