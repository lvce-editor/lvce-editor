import * as ContentSecurityPolicyMenuWorker from '../ContentSecurityPolicyMenuWorker/ContentSecurityPolicyMenuWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersMenuWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyMenuWorker.value)
}
