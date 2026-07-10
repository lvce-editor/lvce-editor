import * as ContentSecurityPolicyRenameWorker from '../ContentSecurityPolicyRenameWorker/ContentSecurityPolicyRenameWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersRenameWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyRenameWorker.value)
}
