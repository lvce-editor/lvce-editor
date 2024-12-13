import * as ContentSecurityPolicyTextSearchWorker from '../ContentSecurityPolicyTextSearchWorker/ContentSecurityPolicyTextSearchWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersTextSearchWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTextSearchWorker.value)
}
