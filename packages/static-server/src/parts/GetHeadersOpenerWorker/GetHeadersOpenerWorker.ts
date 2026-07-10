import * as ContentSecurityPolicyOpenerWorker from '../ContentSecurityPolicyOpenerWorker/ContentSecurityPolicyOpenerWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersOpenerBarWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyOpenerWorker.value)
}
