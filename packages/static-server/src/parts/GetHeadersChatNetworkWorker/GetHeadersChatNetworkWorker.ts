import * as ContentSecurityPolicyChatNetworkWorker from '../ContentSecurityPolicyChatNetworkWorker/ContentSecurityPolicyChatNetworkWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersChatNetworkWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatNetworkWorker.value)
}
