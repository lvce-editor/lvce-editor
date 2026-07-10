import * as ContentSecurityPolicyColorPickerWorker from '../ContentSecurityPolicyColorPickerWorker/ContentSecurityPolicyColorPickerWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersColorPickerWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyColorPickerWorker.value)
}
