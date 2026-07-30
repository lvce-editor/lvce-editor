import * as ContentSecurityPolicyState from '../ContentSecurityPolicyState/ContentSecurityPolicyState.ts'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const getHeadersOtherWorker = (url: any): any => {
  const headers: Record<string, any> = {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
  }
  const dynamicCsp = ContentSecurityPolicyState.get(url)
  if (dynamicCsp) {
    headers[HttpHeader.ContentSecurityPolicy] = dynamicCsp
  }
  return headers
}
