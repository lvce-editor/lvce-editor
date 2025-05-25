import * as GetContentResponse from '../GetContentResponse/GetContentResponse.js'
import * as GetElectronFileResponseAbsolutePath from '../GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.js'
import * as GetElectronFileResponseContent from '../GetElectronFileResponseContent/GetElectronFileResponseContent.js'
import * as GetElectronFileResponseRelativePath from '../GetElectronFileResponseRelativePath/GetElectronFileResponseRelativePath.js'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as GetNotFoundResponse from '../GetNotFoundResponse/GetNotFoundResponse.js'
import * as GetNotModifiedResponse from '../GetNotModifiedResponse/GetNotModifiedResponse.js'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.js'
import * as GetServerErrorResponse from '../GetServerErrorResponse/GetServerErrorResponse.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as Logger from '../Logger/Logger.js'

// TODO maybe handle app responses and webview responses separately
// maybe send webview requests directly to preview process
export const getElectronFileResponse = async (url, request) => {
  try {
    const pathName = GetElectronFileResponseRelativePath.getElectronFileResponseRelativePath(url)
    let absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(pathName)
    let etag
    // TODO when is there no request?
    if (request) {
      etag = await GetPathEtag.getPathEtag(absolutePath)
      if (request.headers[HttpHeader.IfNotMatch] === etag) {
        const headers = await GetHeaders.getHeaders(absolutePath, pathName, etag, url)
        return GetNotModifiedResponse.getNotModifiedResponse(headers)
      }
    }
    const content = await GetElectronFileResponseContent.getElectronFileResponseContent(request, absolutePath, url)
    const headers = await GetHeaders.getHeaders(absolutePath, pathName, etag, url)

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
