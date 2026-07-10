import * as ContentSecurityPolicyCompletionWorker from '../ContentSecurityPolicyCompletionWorker/ContentSecurityPolicyCompletionWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersCompletionWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyCompletionWorker.value)
}
