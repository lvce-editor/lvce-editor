import * as ContentSecurityPolicyFileSystemWorker from '../ContentSecurityPolicyFileSystemWorker/ContentSecurityPolicyFileSystemWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersFileSystemWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyFileSystemWorker.value)
}
