import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `font-src 'self'`,
  `img-src 'self' https: data:`,
  `media-src 'self'`,
  `script-src 'self'`,
  `style-src 'self'`,
])
