"use client"

import { authConfig } from "./auth-config"

// Rate limiting implementation
interface RateLimitEntry {
  count: number
  firstAttempt: number
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry>

  constructor() {
    if (typeof window !== "undefined") {
      this.attempts = new Map()
    } else {
      this.attempts = new Map()
    }
  }

  checkRateLimit(key: string): boolean {
    if (typeof window === "undefined") return true
    
    const now = Date.now()
    const entry = this.attempts.get(key)

    if (!entry) {
      this.attempts.set(key, { count: 1, firstAttempt: now })
      return true
    }

    if (now - entry.firstAttempt > authConfig.rateLimitWindow) {
      this.attempts.set(key, { count: 1, firstAttempt: now })
      return true
    }

    entry.count++
    this.attempts.set(key, entry)

    return entry.count <= authConfig.maxAttempts
  }

  getRemainingAttempts(key: string): number {
    if (typeof window === "undefined") return authConfig.maxAttempts
    
    const entry = this.attempts.get(key)
    if (!entry) return authConfig.maxAttempts

    const now = Date.now()
    if (now - entry.firstAttempt > authConfig.rateLimitWindow) {
      return authConfig.maxAttempts
    }

    return Math.max(0, authConfig.maxAttempts - entry.count)
  }

  getTimeUntilReset(key: string): number {
    if (typeof window === "undefined") return 0
    
    const entry = this.attempts.get(key)
    if (!entry) return 0

    const now = Date.now()
    const timeElapsed = now - entry.firstAttempt
    return Math.max(0, authConfig.rateLimitWindow - timeElapsed)
  }
}

export const rateLimiter = new RateLimiter()

export function isSessionExpired(loginTime: number): boolean {
  if (typeof window === "undefined") return false
  return Date.now() - loginTime > authConfig.sessionDuration
}

export function isStrongPassword(password: string): boolean {
  const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = authConfig.passwordRequirements
  
  const hasUpperCase = !requireUppercase || /[A-Z]/.test(password)
  const hasLowerCase = !requireLowercase || /[a-z]/.test(password)
  const hasNumbers = !requireNumbers || /\d/.test(password)
  const hasSpecialChar = !requireSpecialChars || /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  )
}

let csrfToken: string | null = null

export function generateCSRFToken(): string {
  if (typeof window === "undefined") return ""
  const token = Math.random().toString(36).slice(2)
  csrfToken = token
  return token
}

export function validateCSRFToken(token: string): boolean {
  if (typeof window === "undefined") return true
  return token === csrfToken
}

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