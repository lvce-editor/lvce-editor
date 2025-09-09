import * as ContentSecurityPolicyHoverWorker from '../ContentSecurityPolicyHoverWorker/ContentSecurityPolicyHoverWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersHoverWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyHoverWorker.value)
}
