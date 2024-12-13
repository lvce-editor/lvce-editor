import * as ContentSecurityPolicyFileSearchWorker from '../ContentSecurityPolicyFileSearchWorker/ContentSecurityPolicyFileSearchWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersFileSearchWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyFileSearchWorker.value)
}
