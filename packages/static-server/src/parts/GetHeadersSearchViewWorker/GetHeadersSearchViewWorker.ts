import * as ContentSecurityPolicySearchViewWorker from '../ContentSecurityPolicySearchViewWorker/ContentSecurityPolicySearchViewWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersSearchViewWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySearchViewWorker.value)
}
