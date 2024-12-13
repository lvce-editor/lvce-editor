import * as ContentSecurityPolicyRendererWorker from '../ContentSecurityPolicyRendererWorker/ContentSecurityPolicyRendererWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersRendererWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyRendererWorker.value)
}
