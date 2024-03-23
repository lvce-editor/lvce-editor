import * as ContentSecurityPolicyDocument from '../ContentSecurityPolicyDocument/ContentSecurityPolicyDocument.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js'

export const getHeadersMainFrame = () => {
  return {
    [ContentSecurityPolicyDocument.key]: ContentSecurityPolicyDocument.value,
    [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
    [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
  }
}
