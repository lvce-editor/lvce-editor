import * as ContentSecurityPolicyDebugWorker from '../ContentSecurityPolicyDebugWorker/ContentSecurityPolicyDebugWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersDebugWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyDebugWorker.value)
}
