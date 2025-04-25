import * as ContentSecurityPolicyErrorWorker from '../ContentSecurityPolicyErrorWorker/ContentSecurityPolicyErrorWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersErrorWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyErrorWorker.value)
}
