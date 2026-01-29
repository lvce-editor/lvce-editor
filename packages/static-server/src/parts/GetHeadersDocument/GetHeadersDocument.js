import * as CachingHeaders from '../CachingHeaders/CachingHeaders.js'
import * as ContentSecurityPolicyDocument from '../ContentSecurityPolicyDocument/ContentSecurityPolicyDocument.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersDocument = ({ mime, etag, isForElectronProduction, applicationName }) => {
  return {
    [HttpHeader.CacheControl]: CachingHeaders.NoCache,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyDocument.getValue({ isForElectronProduction, applicationName }),
    [HttpHeader.ContentType]: mime,
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
    [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
    [HttpHeader.Etag]: etag,
  }
}
