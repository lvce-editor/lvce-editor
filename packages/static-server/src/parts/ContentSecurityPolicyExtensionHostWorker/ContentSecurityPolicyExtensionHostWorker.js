import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `connect-src 'self'`, // TODO should extension host worker be allowed to do network requests?
  `script-src 'self'`,
  `font-src 'self'`,
])
