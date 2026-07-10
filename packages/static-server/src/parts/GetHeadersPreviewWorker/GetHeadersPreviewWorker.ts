import * as ContentSecurityPolicyPreviewWorker from '../ContentSecurityPolicyPreviewWorker/ContentSecurityPolicyPreviewWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersPreviewWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyPreviewWorker.value)
}
