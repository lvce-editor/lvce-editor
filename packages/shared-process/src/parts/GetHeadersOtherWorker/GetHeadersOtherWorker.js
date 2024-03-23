import * as ContentSecurityPolicyState from '../ContentSecurityPolicyState/ContentSecurityPolicyState.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'

export const getHeadersOtherWorker = (url) => {
  const headers = {
    [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
  }
  const dynamicCsp = ContentSecurityPolicyState.get(url)
  if (dynamicCsp) {
    headers['Content-Security-Policy'] = dynamicCsp
  }
  return headers
}
