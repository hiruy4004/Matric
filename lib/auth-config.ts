export const authConfig = {
  sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
} 