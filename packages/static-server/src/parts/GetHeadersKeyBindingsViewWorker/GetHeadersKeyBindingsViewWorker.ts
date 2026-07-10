import * as ContentSecurityPolicyKeyBindingsWorker from '../ContentSecurityPolicyKeyBindingsWorker/ContentSecurityPolicyKeyBindingsWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersKeyBindingsViewWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyKeyBindingsWorker.value)
}
