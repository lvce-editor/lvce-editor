import * as ContentSecurityPolicyTitleBarWorker from '../ContentSecurityPolicyTitleBarWorker/ContentSecurityPolicyTitleBarWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersTitleBarWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyTitleBarWorker.value,
  }
}
