import DOMPurify from 'dompurify'

export function sanitizeInput(input: any): any {
  // If input is null or undefined, return as is
  if (input === null || input === undefined) {
    return input
  }

  // If input is a primitive type, sanitize it
  if (typeof input !== 'object') {
    return typeof input === 'string' 
      ? stripHtmlTags(escapeHtml(input.trim()))
      : input
  }

  // If input is an array, recursively sanitize each element
  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }

  // If input is an object, recursively sanitize each value
  const sanitizedObject: Record<string, any> = {}
  for (const [key, value] of Object.entries(input)) {
    // Prevent prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue
    }
    sanitizedObject[key] = sanitizeInput(value)
  }

  return sanitizedObject
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, one uppercase, one lowercase, one number, one special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}
