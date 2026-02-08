import * as ContentSecurityPolicyLanguageModelsView from '../ContentSecurityPolicyLanguageModelsView/ContentSecurityPolicyLanguageModelsView.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersLanguageModelsView = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyLanguageModelsView.value)
}
