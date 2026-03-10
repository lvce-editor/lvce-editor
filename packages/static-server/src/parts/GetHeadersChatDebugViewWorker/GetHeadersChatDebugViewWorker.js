import * as ContentSecurityPolicyChatDebugViewWorker from '../ContentSecurityPolicyChatDebugViewWorker/ContentSecurityPolicyChatDebugViewWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersChatDebugViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatDebugViewWorker.value)
}
