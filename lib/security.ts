"use client"

// Rate limiting implementation
interface RateLimitEntry {
  count: number
  firstAttempt: number
}

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5

class RateLimiter {
  private attempts: Map<string, RateLimitEntry>

  constructor() {
    this.attempts = new Map()
  }

  checkRateLimit(key: string): boolean {
    const now = Date.now()
    const entry = this.attempts.get(key)

    if (!entry) {
      this.attempts.set(key, { count: 1, firstAttempt: now })
      return true
    }

    // Reset if outside window
    if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
      this.attempts.set(key, { count: 1, firstAttempt: now })
      return true
    }

    // Increment count
    entry.count++
    this.attempts.set(key, entry)

    // Check if exceeded
    return entry.count <= MAX_ATTEMPTS
  }

  getRemainingAttempts(key: string): number {
    const entry = this.attempts.get(key)
    if (!entry) return MAX_ATTEMPTS

    const now = Date.now()
    if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
      return MAX_ATTEMPTS
    }

    return Math.max(0, MAX_ATTEMPTS - entry.count)
  }

  getTimeUntilReset(key: string): number {
    const entry = this.attempts.get(key)
    if (!entry) return 0

    const now = Date.now()
    const timeElapsed = now - entry.firstAttempt
    return Math.max(0, RATE_LIMIT_WINDOW - timeElapsed)
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter()

// Session security
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function isSessionExpired(loginTime: number): boolean {
  return Date.now() - loginTime > SESSION_DURATION
}

// Password security
export function isStrongPassword(password: string): boolean {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  )
}

// CSRF Protection
let csrfToken: string | null = null

export function generateCSRFToken(): string {
  const token = Math.random().toString(36).slice(2)
  csrfToken = token
  return token
}

export function validateCSRFToken(token: string): boolean {
  return token === csrfToken
}

// Security headers
export const securityHeaders = {
  "Content-Security-Policy": 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data: https:;",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": 
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), " +
    "magnetometer=(), microphone=(), payment=(), usb=()"
} 