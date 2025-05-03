import * as ContentSecurityPolicySourceControlWorker from '../ContentSecurityPolicySourceControlWorker/ContentSecurityPolicySourceControlWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersSourceControlWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySourceControlWorker.value)
}
