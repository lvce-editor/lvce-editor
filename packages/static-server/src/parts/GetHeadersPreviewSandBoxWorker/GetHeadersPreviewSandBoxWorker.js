import * as ContentSecurityPolicyPreviewSandBoxWorker from '../ContentSecurityPolicyPreviewSandBoxWorker/ContentSecurityPolicyPreviewSandBoxWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersPreviewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyPreviewSandBoxWorker.value)
}
