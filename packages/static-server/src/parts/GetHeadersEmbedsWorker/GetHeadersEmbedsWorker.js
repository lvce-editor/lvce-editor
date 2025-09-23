import * as ContentSecurityPolicyEmbedsWorker from '../ContentSecurityPolicyEmbedsWorker/ContentSecurityPolicyEmbedsWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersEmbedsWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyEmbedsWorker.value)
}
