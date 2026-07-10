import * as ContentSecurityPolicyChatViewWorker from '../ContentSecurityPolicyChatViewWorker/ContentSecurityPolicyChatViewWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersChatViewWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatViewWorker.value)
}
