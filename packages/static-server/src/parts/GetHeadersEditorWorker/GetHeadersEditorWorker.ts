import * as ContentSecurityPolicyEditorWorker from '../ContentSecurityPolicyEditorWorker/ContentSecurityPolicyEditorWorker.ts'
import * as GetHeadersWorker from '../GetHeadersWorker/GetHeadersWorker.ts'

export const getHeadersEditorWorker = (mime: string, etag: string, defaultCachingHeader: string) => {
  return GetHeadersWorker.getHeadersWorker(mime, etag, defaultCachingHeader, ContentSecurityPolicyEditorWorker.value)
}
