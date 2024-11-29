import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const configPath = path.join(process.cwd(), 'src', 'config', 'navigation.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(configPath, 'utf8')
    return NextResponse.json(JSON.parse(fileContents))
  } catch (error) {
    console.error('Error reading navigation config:', error)
    return NextResponse.json(
      { error: 'Failed to load navigation configuration' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await fs.writeFile(configPath, JSON.stringify(data, null, 2))
    return NextResponse.json({ message: 'Navigation updated successfully' })
  } catch (error) {
    console.error('Error updating navigation config:', error)
    return NextResponse.json(
      { error: 'Failed to update navigation configuration' },
      { status: 500 }
    )
  }
}
