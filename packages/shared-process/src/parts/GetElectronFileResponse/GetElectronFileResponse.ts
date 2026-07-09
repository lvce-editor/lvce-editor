import * as GetContentResponse from '../GetContentResponse/GetContentResponse.ts'
import * as GetElectronFileResponseAbsolutePath from '../GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.ts'
import * as GetElectronFileResponseContent from '../GetElectronFileResponseContent/GetElectronFileResponseContent.ts'
import * as GetElectronFileResponseRelativePath from '../GetElectronFileResponseRelativePath/GetElectronFileResponseRelativePath.ts'
import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as GetNotFoundResponse from '../GetNotFoundResponse/GetNotFoundResponse.ts'
import * as GetNotModifiedResponse from '../GetNotModifiedResponse/GetNotModifiedResponse.ts'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.ts'
import * as GetServerErrorResponse from '../GetServerErrorResponse/GetServerErrorResponse.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as Logger from '../Logger/Logger.ts'

// TODO maybe handle app responses and webview responses separately
// maybe send webview requests directly to preview process
export const getElectronFileResponse = async (url, request) => {
  try {
    const pathName = GetElectronFileResponseRelativePath.getElectronFileResponseRelativePath(url)
    let absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(pathName)
    let etag
    let stats
    // TODO when is there no request?
    if (request) {
      const info = await GetPathEtag.getPathEtag(absolutePath)
      etag = info.etag
      stats = info.stats
      let size = stats.size
      if (absolutePath.endsWith('.html')) {
        // TODO since dynamic data is injected to the stat size is not accurate
        // which is why this workaround is needed
        // but it's a bit inefficient
        const content = await GetElectronFileResponseContent.getElectronFileResponseContent(request, absolutePath, url)
        size = content.byteLength
      }
      if (request.headers[HttpHeader.IfNotMatch] === etag) {
        const headers = await GetHeaders.getHeaders(absolutePath, pathName, etag, url, size)
        return GetNotModifiedResponse.getNotModifiedResponse(headers)
      }
    }
    const content = await GetElectronFileResponseContent.getElectronFileResponseContent(request, absolutePath, url)
    const size = content.byteLength
    const headers = await GetHeaders.getHeaders(absolutePath, pathName, etag, url, size)

    headers[HttpHeader.CacheControl] = 'public, max-age=0, must-revalidate'
    return GetContentResponse.getContentResponse(content, headers)
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return GetNotFoundResponse.getNotFoundResponse()
    }
    Logger.error(error)
    return GetServerErrorResponse.getServerErrorResponse()
  }
}
