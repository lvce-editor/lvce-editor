import * as ContentSecurityPolicyTerminalWorker from '../ContentSecurityPolicyTerminalWorker/ContentSecurityPolicyTerminalWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersTerminalWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTerminalWorker.value)
}
