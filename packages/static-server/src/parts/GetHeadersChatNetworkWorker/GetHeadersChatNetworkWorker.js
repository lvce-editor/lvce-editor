import * as ContentSecurityPolicyChatNetworkWorker from '../ContentSecurityPolicyChatNetworkWorker/ContentSecurityPolicyChatNetworkWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersChatNetworkWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyChatNetworkWorker.value)
}
