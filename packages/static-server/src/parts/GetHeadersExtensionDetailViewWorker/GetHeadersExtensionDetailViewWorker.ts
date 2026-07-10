import * as ContentSecurityPolicyExtensionDetailViewWorker from '../ContentSecurityPolicyExtensionDetailViewWorker/ContentSecurityPolicyExtensionDetailViewWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersExtensionDetailViewWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionDetailViewWorker.value)
}
