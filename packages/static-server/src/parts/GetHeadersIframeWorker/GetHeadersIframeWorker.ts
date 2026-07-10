import * as ContentSecurityPolicyIframeWorker from '../ContentSecurityPolicyIframeWorker/ContentSecurityPolicyIframeWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersIframeWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyIframeWorker.value)
}
