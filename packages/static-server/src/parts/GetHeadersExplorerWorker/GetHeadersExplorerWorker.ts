import * as ContentSecurityPolicyExplorerWorker from '../ContentSecurityPolicyExplorerWorker/ContentSecurityPolicyExplorerWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersExplorerWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExplorerWorker.value)
}
