import * as ContentSecurityPolicyQuickPickWorker from '../ContentSecurityPolicyQuickPickWorker/ContentSecurityPolicyQuickPickWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersQuickPickWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyQuickPickWorker.value)
}
