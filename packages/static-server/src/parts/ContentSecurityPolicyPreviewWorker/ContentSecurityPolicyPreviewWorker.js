import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'

// TODO do the evaluation in a separate worker
export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  "script-src 'self' 'unsafe-eval'",
  'connect-src https://unpkg.com https://esm.sh', // TODO move loading dependencies into a separate worker
  `sandbox allow-same-origin`,
])
