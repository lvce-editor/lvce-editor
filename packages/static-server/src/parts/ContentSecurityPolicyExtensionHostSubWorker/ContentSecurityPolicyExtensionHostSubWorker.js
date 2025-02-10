import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `connect-src *`, // TODO make this dependend on extension.json csp settings
  `script-src 'self'`,
  `font-src 'self'`,
])
