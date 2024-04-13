import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `font-src 'self'`,
  `frame-src *`,
  `img-src 'self' https: data:`,
  `script-src 'self'`,
  `media-src 'self'`,
  `style-src 'self'`,
])
