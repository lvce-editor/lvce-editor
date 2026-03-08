import * as ContentSecurityPolicyChatDebugWorker from '../ContentSecurityPolicyChatDebugWorker/ContentSecurityPolicyChatDebugWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersChatDebugWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatDebugWorker.value)
}
