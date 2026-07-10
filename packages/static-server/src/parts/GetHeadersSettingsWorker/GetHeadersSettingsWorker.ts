import * as ContentSecurityPolicySettingsWorker from '../ContentSecurityPolicySettingsWorker/ContentSecurityPolicySettingsWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersSettingsWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicySettingsWorker.value)
}
