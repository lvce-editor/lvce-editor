import * as ContentSecurityPolicySyntaxHighlightingWorker from '../ContentSecurityPolicySyntaxHighlightingWorker/ContentSecurityPolicySyntaxHighlightingWorker.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'

export const getHeadersSyntaxHighlightingWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicySyntaxHighlightingWorker.value,
  }
}
