import * as ContentSecurityPolicyTestWorker from '../ContentSecurityPolicyTestWorker/ContentSecurityPolicyTestWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'

export const getHeadersExtensionHostWorker = () => {
  return {
    [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
    [ContentSecurityPolicyTestWorker.key]: ContentSecurityPolicyTestWorker.value,
  }
}
