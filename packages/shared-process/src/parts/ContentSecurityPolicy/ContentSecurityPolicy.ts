import * as Assert from '../Assert/Assert.ts'
import * as ContentSecurityPolicyState from '../ContentSecurityPolicyState/ContentSecurityPolicyState.ts'

export const set = (url: any, contentSecurityPolicy: any): any => {
  Assert.string(url)
  Assert.string(contentSecurityPolicy)
  ContentSecurityPolicyState.set(url, contentSecurityPolicy)
}
