import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.ts'

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `connect-src 'self'`,
  `script-src 'self'`,
  `font-src 'self'`,
])
