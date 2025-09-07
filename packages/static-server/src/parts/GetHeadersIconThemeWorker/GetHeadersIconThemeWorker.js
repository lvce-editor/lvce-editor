import * as ContentSecurityPolicyIconThemeWorker from '../ContentSecurityPolicyIconThemeWorker/ContentSecurityPolicyIconThemeWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersIconThemeWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyIconThemeWorker.value)
}
