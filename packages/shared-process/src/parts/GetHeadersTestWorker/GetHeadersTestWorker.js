import * as ContentSecurityPolicyTestWorker from '../ContentSecurityPolicyTestWorker/ContentSecurityPolicyTestWorker.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'

export const getHeadersExtensionHostWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyTestWorker.value,
  }
}
