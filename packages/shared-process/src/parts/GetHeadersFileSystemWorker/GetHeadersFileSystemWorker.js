import * as ContentSecurityPolicyFileSystemWorker from '../ContentSecurityPolicyFileSystemWorker/ContentSecurityPolicyFileSystemWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersFileSystemWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyFileSystemWorker.value,
  }
}
