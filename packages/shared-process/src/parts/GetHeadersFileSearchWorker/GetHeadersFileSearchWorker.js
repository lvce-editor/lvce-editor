import * as ContentSecurityPolicyFileSearchWorker from '../ContentSecurityPolicyFileSearchWorker/ContentSecurityPolicyFileSearchWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersFileSearchWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyFileSearchWorker.value,
  }
}
