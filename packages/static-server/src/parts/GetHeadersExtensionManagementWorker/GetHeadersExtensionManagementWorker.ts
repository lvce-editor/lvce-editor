import * as ContentSecurityPolicyExtensionManagementWorker from '../ContentSecurityPolicyExtensionManagementWorker/ContentSecurityPolicyExtensionManagementWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersExtensionManagementWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionManagementWorker.value)
}
