import * as ContentSecurityPolicyEmbedsWorker from '../ContentSecurityPolicyEmbedsWorker/ContentSecurityPolicyEmbedsWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersEmbedsWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyEmbedsWorker.value)
}
