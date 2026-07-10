import * as ContentSecurityPolicyExtensionSearchViewWorker from '../ContentSecurityPolicyExtensionSearchViewWorker/ContentSecurityPolicyExtensionSearchViewWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersExtensionSearchViewWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionSearchViewWorker.value)
}
