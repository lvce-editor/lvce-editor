import * as ContentSecurityPolicyFileSearchWorker from '../ContentSecurityPolicyFileSearchWorker/ContentSecurityPolicyFileSearchWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersFileSearchWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyFileSearchWorker.value)
}
