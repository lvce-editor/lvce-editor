import * as ContentSecurityPolicyReferenceViewWorker from '../ContentSecurityPolicyReferenceViewWorker/ContentSecurityPolicyReferencesViewWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersReferenceViewWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyReferenceViewWorker.value)
}
