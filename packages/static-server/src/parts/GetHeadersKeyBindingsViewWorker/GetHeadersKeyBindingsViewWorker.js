import * as ContentSecurityPolicyKeyBindingsWorker from '../ContentSecurityPolicyKeyBindingsWorker/ContentSecurityPolicyKeyBindingsWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersKeyBindingsViewWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyKeyBindingsWorker.value)
}
