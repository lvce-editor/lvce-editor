import * as ContentSecurityPolicyLanguageModelsView from '../ContentSecurityPolicyLanguageModelsView/ContentSecurityPolicyLanguageModelsView.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersLanguageModelsView = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyLanguageModelsView.value)
}
