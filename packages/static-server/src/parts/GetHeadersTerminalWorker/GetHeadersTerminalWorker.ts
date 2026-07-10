import * as ContentSecurityPolicyTerminalWorker from '../ContentSecurityPolicyTerminalWorker/ContentSecurityPolicyTerminalWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersTerminalWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTerminalWorker.value)
}
