import * as ContentSecurityPolicy from '../ContentSecurityPolicy/ContentSecurityPolicy.js'

export const set = async (url, contentSecurityPolicy) => {
  await ContentSecurityPolicy.set(url, contentSecurityPolicy)
}
