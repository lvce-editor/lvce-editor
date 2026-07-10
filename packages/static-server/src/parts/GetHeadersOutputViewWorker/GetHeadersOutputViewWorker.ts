import * as ContentSecurityPolicyOutputViewWorker from '../ContentSecurityPolicyOutputViewWorker/ContentSecurityPolicyOutputViewWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersOutputViewWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyOutputViewWorker.value)
}
