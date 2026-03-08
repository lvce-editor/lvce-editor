import * as ContentSecurityPolicyChatStorageWorker from '../ContentSecurityPolicyChatStorageWorker/ContentSecurityPolicyChatStorageWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersChatStorageWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatStorageWorker.value)
}
