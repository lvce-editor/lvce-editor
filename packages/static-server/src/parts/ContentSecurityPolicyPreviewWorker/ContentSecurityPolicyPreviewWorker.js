import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'

// TODO do the evaluation in a separate worker
export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  "script-src 'self' 'unsafe-eval'",
  `sandbox allow-same-origin`,
])
