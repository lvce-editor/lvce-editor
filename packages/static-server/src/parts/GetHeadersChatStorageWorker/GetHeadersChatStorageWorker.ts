import * as ContentSecurityPolicyChatStorageWorker from '../ContentSecurityPolicyChatStorageWorker/ContentSecurityPolicyChatStorageWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersChatStorageWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatStorageWorker.value)
}
