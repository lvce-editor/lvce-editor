import * as Assert from '../Assert/Assert.js'
import * as ContentSecurityPolicyState from '../ContentSecurityPolicyState/ContentSecurityPolicyState.js'

export const set = (url, contentSecurityPolicy) => {
  Assert.string(url)
  Assert.string(contentSecurityPolicy)
  ContentSecurityPolicyState.set(url, contentSecurityPolicy)
}
