import fs from 'fs/promises'
import path from 'path'

const STORAGE_FILE = path.join(process.cwd(), 'data', 'user.json')

interface UserData {
  username: string
  password: string  // This will store the hashed password
}

// Ensure the data directory exists
async function ensureDataDir() {
  const dir = path.dirname(STORAGE_FILE)
  await fs.mkdir(dir, { recursive: true })
}

export async function saveUser(userData: UserData): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(STORAGE_FILE, JSON.stringify(userData, null, 2))
}

export async function getUser(): Promise<UserData | null> {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}
