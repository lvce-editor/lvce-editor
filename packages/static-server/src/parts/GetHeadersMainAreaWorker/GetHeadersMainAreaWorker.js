import * as ContentSecurityPolicyMainAreaWorker from '../ContentSecurityPolicyMainAreaWorker/ContentSecurityPolicyMainAreaWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersMainAreaWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyMainAreaWorker.value)
}
