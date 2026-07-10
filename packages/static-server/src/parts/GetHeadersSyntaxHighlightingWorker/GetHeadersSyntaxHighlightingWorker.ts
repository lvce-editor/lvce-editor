import * as ContentSecurityPolicySyntaxHighlightingWorker from '../ContentSecurityPolicySyntaxHighlightingWorker/ContentSecurityPolicySyntaxHighlightingWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersSyntaxHighlightingWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySyntaxHighlightingWorker.value)
}
