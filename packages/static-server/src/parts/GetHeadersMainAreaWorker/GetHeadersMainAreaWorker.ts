import * as ContentSecurityPolicyMainAreaWorker from '../ContentSecurityPolicyMainAreaWorker/ContentSecurityPolicyMainAreaWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersMainAreaWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyMainAreaWorker.value)
}
