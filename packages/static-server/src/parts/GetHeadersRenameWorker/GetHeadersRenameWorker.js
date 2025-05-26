import * as ContentSecurityPolicyRenameWorker from '../ContentSecurityPolicyRenameWorker/ContentSecurityPolicyRenameWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersRenameWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyRenameWorker.value)
}
