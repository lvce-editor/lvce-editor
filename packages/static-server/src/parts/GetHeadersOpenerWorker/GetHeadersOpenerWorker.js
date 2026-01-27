import * as ContentSecurityPolicyOpenerWorker from '../ContentSecurityPolicyOpenerWorker/ContentSecurityPolicyOpenerWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersOpenerBarWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyOpenerWorker.value)
}
