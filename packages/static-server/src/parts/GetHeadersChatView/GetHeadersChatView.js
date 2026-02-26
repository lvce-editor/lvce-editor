import * as ContentSecurityPolicyChatViewWorker from '../ContentSecurityPolicyChatViewWorker/ContentSecurityPolicyChatViewWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersChatViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatViewWorker.value)
}
