import * as ContentSecurityPolicyExtensionHostSubWorker from '../ContentSecurityPolicyExtensionHostSubWorker/ContentSecurityPolicyExtensionHostSubWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersExtensionHostSubWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionHostSubWorker.value)
}
