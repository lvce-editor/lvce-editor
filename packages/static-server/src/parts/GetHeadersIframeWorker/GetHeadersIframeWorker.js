import * as ContentSecurityPolicyIframeWorker from '../ContentSecurityPolicyIframeWorker/ContentSecurityPolicyIframeWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersIframeWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyIframeWorker.value)
}
