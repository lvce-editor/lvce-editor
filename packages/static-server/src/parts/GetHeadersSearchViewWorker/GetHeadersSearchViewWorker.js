import * as ContentSecurityPolicySearchViewWorker from '../ContentSecurityPolicySearchViewWorker/ContentSecurityPolicySearchViewWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersSearchViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySearchViewWorker.value)
}
