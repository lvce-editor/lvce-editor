import * as ContentSecurityPolicyExtensionHostWorker from '../ContentSecurityPolicyExtensionHostWorker/ContentSecurityPolicyExtensionHostWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersExtensionHostWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionHostWorker.value)
}
