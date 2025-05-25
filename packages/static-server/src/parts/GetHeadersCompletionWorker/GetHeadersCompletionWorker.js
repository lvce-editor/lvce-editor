import * as ContentSecurityPolicyCompletionWorker from '../ContentSecurityPolicyCompletionWorker/ContentSecurityPolicyCompletionWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersCompletionWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyCompletionWorker.value)
}
