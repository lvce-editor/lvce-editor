import * as ContentSecurityPolicyAboutWorker from '../ContentSecurityPolicyAboutWorker/ContentSecurityPolicyAboutWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersAboutWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyAboutWorker.value)
}
