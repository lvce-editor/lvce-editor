import * as ContentSecurityPolicyErrorWorker from '../ContentSecurityPolicyErrorWorker/ContentSecurityPolicyErrorWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersErrorWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyErrorWorker.value)
}
