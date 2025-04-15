import * as ContentSecurityPolicyTextSearchWorker from '../ContentSecurityPolicyTextSearchWorker/ContentSecurityPolicyTextSearchWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersErrorWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyTextSearchWorker.value,
  }
}
