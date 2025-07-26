import * as ContentSecurityPolicySettingsWorker from '../ContentSecurityPolicySettingsWorker/ContentSecurityPolicySettingsWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersSettingsWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySettingsWorker.value)
}
