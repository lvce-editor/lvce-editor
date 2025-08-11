import * as ContentSecurityPolicyOutputViewWorker from '../ContentSecurityPolicyOutputViewWorker/ContentSecurityPolicyOutputViewWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersOutputViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyOutputViewWorker.value)
}
