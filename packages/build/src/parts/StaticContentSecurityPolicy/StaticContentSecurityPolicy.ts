import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.ts'

export const staticContentSecurityPolicy = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `font-src 'self'`,
  `img-src 'self' https: data: blob:`, // TODO maybe disallow https and data images
  `manifest-src 'self'`,
  `media-src 'self' blob:`,
  `script-src 'self'`,
  `style-src 'self' 'unsafe-inline'`,
  `frame-src 'self' blob:`,
])
