import * as ContentSecurityPolicyAboutWorker from '../ContentSecurityPolicyAboutWorker/ContentSecurityPolicyAboutWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersAboutWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyAboutWorker.value)
}
