import * as ContentSecurityPolicyClipBoardWorker from '../ContentSecurityPolicyClipBoardWorker/ContentSecurityPolicyClipBoardWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersClipBoardWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyClipBoardWorker.value)
}
