import * as ContentSecurityPolicyUpdateWorker from '../ContentSecurityPolicyUpdateWorker/ContentSecurityPolicyUpdateWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersUpdateWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyUpdateWorker.value)
}
