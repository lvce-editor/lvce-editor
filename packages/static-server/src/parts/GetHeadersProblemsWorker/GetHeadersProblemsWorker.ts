import * as ContentSecurityPolicyProblemsWorker from '../ContentSecurityPolicyProblemsWorker/ContentSecurityPolicyProblemsWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersProblemsWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyProblemsWorker.value)
}
