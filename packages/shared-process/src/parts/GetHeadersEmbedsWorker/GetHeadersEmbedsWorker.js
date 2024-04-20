import * as ContentSecurityPolicyEmbedsWorker from '../ContentSecurityPolicyEmbedsWorker/ContentSecurityPolicyEmbedsWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersEmbedsWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyEmbedsWorker.value,
  }
}
