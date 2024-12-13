import * as ContentSecurityPolicyExtensionHostWorker from '../ContentSecurityPolicyExtensionHostWorker/ContentSecurityPolicyExtensionHostWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersExtensionHostWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionHostWorker.value)
}
