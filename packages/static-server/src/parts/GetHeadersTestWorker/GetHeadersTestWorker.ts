import * as ContentSecurityPolicyTestWorker from '../ContentSecurityPolicyTestWorker/ContentSecurityPolicyTestWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersTestWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTestWorker.value)
}
