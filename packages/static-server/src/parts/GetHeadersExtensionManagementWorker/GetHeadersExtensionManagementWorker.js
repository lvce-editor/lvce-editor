import * as ContentSecurityPolicyExtensionManagementWorker from '../ContentSecurityPolicyExtensionManagementWorker/ContentSecurityPolicyExtensionManagementWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersExtensionManagementWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionManagementWorker.value)
}
