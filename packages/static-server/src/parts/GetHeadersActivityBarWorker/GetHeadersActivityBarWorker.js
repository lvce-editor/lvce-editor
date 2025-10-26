import * as ContentSecurityPolicyActivityBarWorker from '../ContentSecurityPolicyActivityBarWorker/ContentSecurityPolicyActivityBarWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersActivityBarWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyActivityBarWorker.value)
}
