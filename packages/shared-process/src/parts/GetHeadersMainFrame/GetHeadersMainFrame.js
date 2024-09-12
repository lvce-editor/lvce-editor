import * as ContentSecurityPolicyDocument from '../ContentSecurityPolicyDocument/ContentSecurityPolicyDocument.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersMainFrame = () => {
  return {
    // [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyDocument.value,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
  }
}
