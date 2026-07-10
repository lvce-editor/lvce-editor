import * as ContentSecurityPolicyUpdateWorker from '../ContentSecurityPolicyUpdateWorker/ContentSecurityPolicyUpdateWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersUpdateWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyUpdateWorker.value)
}
