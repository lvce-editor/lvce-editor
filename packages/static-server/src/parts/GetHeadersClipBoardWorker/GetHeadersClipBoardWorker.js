import * as ContentSecurityPolicyClipBoardWorker from '../ContentSecurityPolicyClipBoardWorker/ContentSecurityPolicyClipBoardWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersClipBoardWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyClipBoardWorker.value)
}
