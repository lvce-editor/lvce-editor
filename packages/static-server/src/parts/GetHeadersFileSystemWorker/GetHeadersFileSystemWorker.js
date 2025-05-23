import * as ContentSecurityPolicyFileSystemWorker from '../ContentSecurityPolicyFileSystemWorker/ContentSecurityPolicyFileSystemWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersFileSystemWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyFileSystemWorker.value)
}
