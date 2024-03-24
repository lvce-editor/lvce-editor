import * as ContentSecurityPolicyState from '../ContentSecurityPolicyState/ContentSecurityPolicyState.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersOtherWorker = (url) => {
  const headers = {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
  }
  const dynamicCsp = ContentSecurityPolicyState.get(url)
  if (dynamicCsp) {
    headers[HttpHeader.ContentSecurityPolicy] = dynamicCsp
  }
  return headers
}
