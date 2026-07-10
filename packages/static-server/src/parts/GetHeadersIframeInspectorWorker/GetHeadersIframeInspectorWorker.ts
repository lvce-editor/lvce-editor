import * as ContentSecurityPolicyIframeInspectorWorker from '../ContentSecurityPolicyIframeInspectorWorker/ContentSecurityPolicyIframeInspectorWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersIframeInspectorWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyIframeInspectorWorker.value)
}
