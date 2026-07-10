import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.ts'

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `connect-src https://openrouter.ai https://api.openai.com`,
  `sandbox allow-same-origin`,
])
