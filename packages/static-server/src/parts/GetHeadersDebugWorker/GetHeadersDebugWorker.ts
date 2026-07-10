import * as ContentSecurityPolicyDebugWorker from '../ContentSecurityPolicyDebugWorker/ContentSecurityPolicyDebugWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersDebugWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyDebugWorker.value)
}
