import * as ContentSecurityPolicyTextMeasurementWorker from '../ContentSecurityPolicyTextMeasurementWorker/ContentSecurityPolicyTextMeasurementWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersTextMeasurementWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTextMeasurementWorker.value)
}
