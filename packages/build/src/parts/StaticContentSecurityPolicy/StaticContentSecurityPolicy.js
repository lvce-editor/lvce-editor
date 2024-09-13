import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'

export const staticContentSecurityPolicy = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `font-src 'self'`,
  `img-src 'self' https: data: blob:`, // TODO maybe disallow https and data images
  `manifest-src 'self'`,
  `media-src 'self'`,
  `script-src 'self'`,
  `style-src 'self'`,
  `frame-src 'self' :blob`,
])
