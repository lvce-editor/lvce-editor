import * as ContentSecurityPolicyWorker from '../ContentSecurityPolicyWorker/ContentSecurityPolicyWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'

export const getHeadersRendererWorker = () => {
  return {
    [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
    [ContentSecurityPolicyWorker.key]: ContentSecurityPolicyWorker.value,
  }
}
