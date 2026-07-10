import * as ContentSecurityPolicyActivityBarWorker from '../ContentSecurityPolicyActivityBarWorker/ContentSecurityPolicyActivityBarWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersActivityBarWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyActivityBarWorker.value)
}
