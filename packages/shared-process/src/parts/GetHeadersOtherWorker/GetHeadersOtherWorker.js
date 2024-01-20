import * as ContentSecurityPolicyWorker from '../ContentSecurityPolicyWorker/ContentSecurityPolicyWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'

export const getHeadersRendererWorker = () => {
  return {
    [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
    [ContentSecurityPolicyWorker.key]: `default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';`,
  }
}
