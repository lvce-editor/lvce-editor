import * as ContentSecurityPolicyAboutWorker from '../ContentSecurityPolicyAboutWorker/ContentSecurityPolicyAboutWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersIframeInspectorWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyAboutWorker.value,
  }
}
