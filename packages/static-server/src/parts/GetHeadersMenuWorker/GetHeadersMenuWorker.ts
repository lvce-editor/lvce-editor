import * as ContentSecurityPolicyMenuWorker from '../ContentSecurityPolicyMenuWorker/ContentSecurityPolicyMenuWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersMenuWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyMenuWorker.value)
}
