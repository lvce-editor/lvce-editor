import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([`default-src 'none'`, `script-src 'self'`, `sandbox allow-same-origin`])
