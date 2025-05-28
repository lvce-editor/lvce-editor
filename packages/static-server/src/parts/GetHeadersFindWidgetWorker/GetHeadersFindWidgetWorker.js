import * as ContentSecurityPolicyFindWidgetWorker from '../ContentSecurityPolicyFindWidgetWorker/ContentSecurityPolicyFindWidgetWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersFindWidgetWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyFindWidgetWorker.value)
}
