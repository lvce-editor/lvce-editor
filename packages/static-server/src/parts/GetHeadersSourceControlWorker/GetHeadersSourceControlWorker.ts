import * as ContentSecurityPolicySourceControlWorker from '../ContentSecurityPolicySourceControlWorker/ContentSecurityPolicySourceControlWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersSourceControlWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySourceControlWorker.value)
}
