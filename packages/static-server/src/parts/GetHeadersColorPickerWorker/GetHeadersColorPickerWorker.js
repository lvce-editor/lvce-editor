import * as ContentSecurityPolicyColorPickerWorker from '../ContentSecurityPolicyColorPickerWorker/ContentSecurityPolicyColorPickerWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersColorPickerWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyColorPickerWorker.value)
}
