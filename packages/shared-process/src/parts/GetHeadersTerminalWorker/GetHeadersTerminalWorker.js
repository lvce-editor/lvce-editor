import * as ContentSecurityPolicyTerminalWorker from '../ContentSecurityPolicyTerminalWorker/ContentSecurityPolicyTerminalWorker.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'

export const getHeadersTerminalWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyTerminalWorker.value,
  }
}
