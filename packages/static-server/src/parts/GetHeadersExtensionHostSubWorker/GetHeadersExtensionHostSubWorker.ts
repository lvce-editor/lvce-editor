import * as ContentSecurityPolicyExtensionHostSubWorker from '../ContentSecurityPolicyExtensionHostSubWorker/ContentSecurityPolicyExtensionHostSubWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersExtensionHostSubWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExtensionHostSubWorker.value)
}
