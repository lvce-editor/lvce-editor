import * as ContentSecurityPolicySourceActionWorker from '../ContentSecurityPolicySourceActionWorker/ContentSecurityPolicySourceActionWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersSourceActionWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySourceActionWorker.value)
}
