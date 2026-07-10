import * as ContentSecurityPolicyChatDebugWorker from '../ContentSecurityPolicyChatDebugWorker/ContentSecurityPolicyChatDebugWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersChatDebugWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatDebugWorker.value)
}
