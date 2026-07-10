import * as ContentSecurityPolicyIconThemeWorker from '../ContentSecurityPolicyIconThemeWorker/ContentSecurityPolicyIconThemeWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersIconThemeWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyIconThemeWorker.value)
}
