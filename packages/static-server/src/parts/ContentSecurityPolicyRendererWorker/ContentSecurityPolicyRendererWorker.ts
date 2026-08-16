import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.ts'

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `connect-src 'self' ws://127.0.0.1:* ws://localhost:*`,
  `script-src 'self'`,
  `font-src 'self'`,
])
