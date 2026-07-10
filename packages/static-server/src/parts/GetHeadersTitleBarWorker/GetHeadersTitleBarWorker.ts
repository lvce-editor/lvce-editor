import * as ContentSecurityPolicyMarkdownWorker from '../ContentSecurityPolicyMarkdownWorker/ContentSecurityPolicyMarkdownWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersTitleBarWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyMarkdownWorker.value)
}
