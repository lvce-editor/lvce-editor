import * as ContentSecurityPolicyIframeInspectorWorker from '../ContentSecurityPolicyIframeInspectorWorker/ContentSecurityPolicyIframeInspectorWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersIframeInspectorWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyIframeInspectorWorker.value)
}
