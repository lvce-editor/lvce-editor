import * as ContentSecurityPolicyEditorWorker from '../ContentSecurityPolicyEditorWorker/ContentSecurityPolicyEditorWorker.js'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.js'

export const getHeadersEditorWorker = (mime, etag, defaultCachingHeader) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyEditorWorker.value)
}
