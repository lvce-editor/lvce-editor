import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import * as IsElectron from '../IsElectron/IsElectron.js'

export const value = IsElectron.isElectron
  ? GetContentSecurityPolicy.getContentSecurityPolicy([`default-src 'none'`, `sandbox allow-same-origin`])
  : GetContentSecurityPolicy.getContentSecurityPolicy([`default-src 'none'`, `connect-src 'self'`, `sandbox allow-same-origin`])
