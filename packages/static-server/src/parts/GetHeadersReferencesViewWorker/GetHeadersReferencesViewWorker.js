import * as ContentSecurityPolicyReferenceViewWorker from '../ContentSecurityPolicyReferenceViewWorker/ContentSecurityPolicyReferencesViewWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersReferenceViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyReferenceViewWorker.value)
}
