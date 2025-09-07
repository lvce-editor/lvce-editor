import * as ContentSecurityPolicyStatusBarWorker from '../ContentSecurityPolicyStatusBarWorker/ContentSecurityPolicyStatusBarWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersStatusBarWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyStatusBarWorker.value)
}
