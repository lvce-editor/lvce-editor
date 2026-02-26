import * as ContentSecurityPolicyQuickPickWorker from '../ContentSecurityPolicyQuickPickWorker/ContentSecurityPolicyQuickPickWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersQuickPickWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyQuickPickWorker.value)
}
