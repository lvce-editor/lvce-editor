import * as ContentSecurityPolicySourceActionWorker from '../ContentSecurityPolicySourceActionWorker/ContentSecurityPolicySourceActionWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersSourceActionWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySourceActionWorker.value)
}
