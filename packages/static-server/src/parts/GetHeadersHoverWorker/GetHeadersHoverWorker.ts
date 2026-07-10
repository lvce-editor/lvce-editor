import * as ContentSecurityPolicyHoverWorker from '../ContentSecurityPolicyHoverWorker/ContentSecurityPolicyHoverWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersHoverWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyHoverWorker.value)
}
