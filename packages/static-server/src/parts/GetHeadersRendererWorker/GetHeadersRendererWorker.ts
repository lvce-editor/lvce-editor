import * as ContentSecurityPolicyRendererWorker from '../ContentSecurityPolicyRendererWorker/ContentSecurityPolicyRendererWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersRendererWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyRendererWorker.value)
}
