import * as ContentSecurityPolicyCompletionWorker from '../ContentSecurityPolicyCompletionWorker/ContentSecurityPolicyCompletionWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersCompletionWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyCompletionWorker.value,
  }
}
