import * as ContentSecurityPolicyTextMeasurementWorker from '../ContentSecurityPolicyTextMeasurementWorker/ContentSecurityPolicyTextMeasurementWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersTextMeasurementWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyTextMeasurementWorker.value)
}
