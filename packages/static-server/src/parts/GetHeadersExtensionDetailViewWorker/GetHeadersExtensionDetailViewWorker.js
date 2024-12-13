import * as ContentSecurityPolicyExtensionDetailViewWorker from '../ContentSecurityPolicyExtensionDetailViewWorker/ContentSecurityPolicyExtensionDetailViewWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersExtensionDetailViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionDetailViewWorker.value)
}
