import * as ContentSecurityPolicyExplorerWorker from '../ContentSecurityPolicyExplorerWorker/ContentSecurityPolicyExplorerWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersExplorerWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyExplorerWorker.value)
}
