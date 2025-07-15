import * as ContentSecurityPolicyProblemsWorker from '../ContentSecurityPolicyProblemsWorker/ContentSecurityPolicyProblemsWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersProblemsWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyProblemsWorker.value)
}
