import * as ContentSecurityPolicyPreviewWorker from '../ContentSecurityPolicyPreviewWorker/ContentSecurityPolicyPreviewWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersPreviewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyPreviewWorker.value)
}
