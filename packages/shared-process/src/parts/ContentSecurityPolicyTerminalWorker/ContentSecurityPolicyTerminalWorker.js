import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import * as IsElectron from '../IsElectron/IsElectron.js'

export const value = IsElectron.isElectron
  ? GetContentSecurityPolicy.getContentSecurityPolicy([`default-src 'none'`, `script-src 'self'`])
  : GetContentSecurityPolicy.getContentSecurityPolicy([`default-src 'none'`, `script-src 'self'`, `connect-src 'self'`])
