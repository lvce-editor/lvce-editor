import * as Assert from '../Assert/Assert.js'

export const set = (url, contentSecurityPolicy) => {
  Assert.string(url)
  Assert.string(contentSecurityPolicy)
}
