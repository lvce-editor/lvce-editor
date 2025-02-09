import * as ContentSecurityPolicyMarkdownWorker from '../ContentSecurityPolicyMarkdownWorker/ContentSecurityPolicyMarkdownWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersTitleBarWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyMarkdownWorker.value)
}
