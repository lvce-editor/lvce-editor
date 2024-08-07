import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import * as IsElectron from '../IsElectron/IsElectron.js'

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `font-src 'self'`,
  `img-src 'self' https: data:`,
  `media-src 'self'`,
  `script-src 'self'`,
  `style-src 'self'`,
  `frame-src 'self' http://localhost:3001`,
  ...(IsElectron.isElectron ? [] : [`manifest-src 'self'`]),
])
