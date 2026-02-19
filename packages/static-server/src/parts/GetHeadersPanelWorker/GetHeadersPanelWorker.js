import * as ContentSecurityPolicyPanelWorker from '../ContentSecurityPolicyPanelWorker/ContentSecurityPolicyPanelWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersPanelWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyPanelWorker.value)
}
