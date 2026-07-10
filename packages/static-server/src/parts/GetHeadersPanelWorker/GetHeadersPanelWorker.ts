import * as ContentSecurityPolicyPanelWorker from '../ContentSecurityPolicyPanelWorker/ContentSecurityPolicyPanelWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersPanelWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyPanelWorker.value)
}
