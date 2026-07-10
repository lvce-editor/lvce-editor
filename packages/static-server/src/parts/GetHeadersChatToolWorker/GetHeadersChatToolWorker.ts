import * as ContentSecurityPolicyChatToolWorker from '../ContentSecurityPolicyChatToolWorker/ContentSecurityPolicyChatToolWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersChatToolWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatToolWorker.value)
}
