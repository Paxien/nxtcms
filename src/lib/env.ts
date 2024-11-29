import fs from 'fs/promises'
import path from 'path'

export async function updateEnvFile(updates: Record<string, string>) {
  try {
    // Read the current .env file
    const envPath = path.join(process.cwd(), '.env')
    let envContent = ''
    
    try {
      envContent = await fs.readFile(envPath, 'utf-8')
    } catch (error) {
      // If .env doesn't exist, create it from .env.example
      const examplePath = path.join(process.cwd(), '.env.example')
      envContent = await fs.readFile(examplePath, 'utf-8')
    }

    // Update environment variables
    const envLines = envContent.split('\n')
    const updatedLines = envLines.map(line => {
      const [key] = line.split('=')
      if (!key) return line
      const trimmedKey = key.trim()
      if (updates[trimmedKey]) {
        return `${trimmedKey}=${updates[trimmedKey]}`
      }
      return line
    })

    // Add any new variables that weren't in the file
    Object.entries(updates).forEach(([key, value]) => {
      if (!envLines.some(line => line.startsWith(key))) {
        updatedLines.push(`${key}=${value}`)
      }
    })

    // Write back to .env file
    await fs.writeFile(envPath, updatedLines.join('\n'))

    // Update process.env
    Object.entries(updates).forEach(([key, value]) => {
      process.env[key] = value
    })
  } catch (error) {
    console.error('Failed to update .env file:', error)
    throw new Error('Failed to save credentials')
  }
}
