import * as ContentSecurityPolicyTestWorker from '../ContentSecurityPolicyTestWorker/ContentSecurityPolicyTestWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersTestWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTestWorker.value)
}
