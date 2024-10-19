import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([`default-src 'none'`, `font-src 'self'`, `sandbox allow-same-origin`])
