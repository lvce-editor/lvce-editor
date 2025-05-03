import * as ContentSecurityPolicySourceControlWorker from '../ContentSecurityPolicySourceControlWorker/ContentSecurityPolicySourceControlWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersSourceControlWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicySourceControlWorker.value,
  }
}
