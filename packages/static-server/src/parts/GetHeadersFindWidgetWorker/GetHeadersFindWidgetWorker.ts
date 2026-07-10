import * as ContentSecurityPolicyFindWidgetWorker from '../ContentSecurityPolicyFindWidgetWorker/ContentSecurityPolicyFindWidgetWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersFindWidgetWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyFindWidgetWorker.value)
}
