import * as ContentSecurityPolicyTextSearchWorker from '../ContentSecurityPolicyTextSearchWorker/ContentSecurityPolicyTextSearchWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersTextSearchWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTextSearchWorker.value)
}
