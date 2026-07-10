import * as ContentSecurityPolicyStatusBarWorker from '../ContentSecurityPolicyStatusBarWorker/ContentSecurityPolicyStatusBarWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersStatusBarWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyStatusBarWorker.value)
}
