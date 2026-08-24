import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.ts'

export const staticContentSecurityPolicy = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `connect-src 'self' https: wss: http://127.0.0.1:* http://localhost:* ws://127.0.0.1:* ws://localhost:*`,
  `font-src 'self'`,
  `img-src 'self' https: data: blob:`, // TODO maybe disallow https and data images
  `manifest-src 'self'`,
  `media-src 'self' blob:`,
  `script-src 'self'`,
  `style-src 'self' 'unsafe-inline'`,
  `frame-src 'self' blob:`,
])
