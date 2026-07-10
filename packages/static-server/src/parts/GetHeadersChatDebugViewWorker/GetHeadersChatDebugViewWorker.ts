import * as ContentSecurityPolicyChatDebugViewWorker from '../ContentSecurityPolicyChatDebugViewWorker/ContentSecurityPolicyChatDebugViewWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersChatDebugViewWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatDebugViewWorker.value)
}
