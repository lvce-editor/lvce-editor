import * as ContentSecurityPolicyExtensionSearchViewWorker from '../ContentSecurityPolicyExtensionSearchViewWorker/ContentSecurityPolicyExtensionSearchViewWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersExtensionSearchViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionSearchViewWorker.value)
}
