import { pathToFileURL } from 'node:url'
import * as GetByteRange from '../GetByteRange/GetByteRange.ts'
import * as GetContentResponse from '../GetContentResponse/GetContentResponse.ts'
import * as GetElectronFileResponseAbsolutePath from '../GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.ts'
import * as GetElectronFileResponseContent from '../GetElectronFileResponseContent/GetElectronFileResponseContent.ts'
import * as GetElectronFileResponseRelativePath from '../GetElectronFileResponseRelativePath/GetElectronFileResponseRelativePath.ts'
import * as GetHeaders from '../GetHeaders/GetHeaders.ts'
import * as GetNotFoundResponse from '../GetNotFoundResponse/GetNotFoundResponse.ts'
import * as GetNotModifiedResponse from '../GetNotModifiedResponse/GetNotModifiedResponse.ts'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.ts'
import * as GetServerErrorResponse from '../GetServerErrorResponse/GetServerErrorResponse.ts'
import * as GetTypeScriptSyntaxErrorResponse from '../GetTypeScriptSyntaxErrorResponse/GetTypeScriptSyntaxErrorResponse.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as IsTypeScriptSyntaxError from '../IsTypeScriptSyntaxError/IsTypeScriptSyntaxError.ts'
import * as Logger from '../Logger/Logger.ts'

export const resolveElectronFileUri = (url: string): string => {
  const pathName = GetElectronFileResponseRelativePath.getElectronFileResponseRelativePath(url)
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(pathName)
  return pathToFileURL(absolutePath).toString()
}

// TODO maybe handle app responses and webview responses separately
// maybe send webview requests directly to preview process
export const getElectronFileResponse = async (url: any, request: any): Promise<any> => {
  try {
    const pathName = GetElectronFileResponseRelativePath.getElectronFileResponseRelativePath(url)
    let absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(pathName)
    let etag
    let preparedContent
    let stats
    let totalSize
    // TODO when is there no request?
    if (request) {
      const info = await GetPathEtag.getPathEtag(absolutePath)
      etag = info.etag
      stats = info.stats
      let size = stats.size
      totalSize = size
      if (absolutePath.endsWith('.html')) {
        // TODO since dynamic data is injected to the stat size is not accurate
        // which is why this workaround is needed
        // but it's a bit inefficient
        preparedContent = await GetElectronFileResponseContent.getElectronFileResponseContent(request, absolutePath, url)
        size = preparedContent.byteLength
      }
      if (request.headers[HttpHeader.IfNotMatch] === etag) {
        const headers = await GetHeaders.getHeaders(absolutePath, pathName, etag, url, size)
        return GetNotModifiedResponse.getNotModifiedResponse(headers)
      }
    }
    const rangeHeader = request?.headers?.[HttpHeader.Range]
    if (rangeHeader && pathName.startsWith('/remote') && typeof totalSize === 'number') {
      const range = GetByteRange.getByteRange(rangeHeader, totalSize)
      if (!range) {
        const headers = await GetHeaders.getHeaders(absolutePath, pathName, etag, url, 0)
        headers[HttpHeader.CacheControl] = 'public, max-age=0, must-revalidate'
        headers[HttpHeader.ContentRange] = `bytes */${totalSize}`
        return GetContentResponse.getContentResponse(Buffer.alloc(0), headers, HttpStatusCode.RangeNotSatisfiable)
      }
      const content = await GetElectronFileResponseContent.getElectronFileResponseContent(request, absolutePath, url, range)
      const headers = await GetHeaders.getHeaders(absolutePath, pathName, etag, url, content.byteLength)
      headers[HttpHeader.CacheControl] = 'public, max-age=0, must-revalidate'
      headers[HttpHeader.ContentRange] = `bytes ${range.start}-${range.end}/${totalSize}`
      return GetContentResponse.getContentResponse(content, headers, HttpStatusCode.PartialContent)
    }
    const content = preparedContent || (await GetElectronFileResponseContent.getElectronFileResponseContent(request, absolutePath, url))
    const size = content.byteLength
    const headers = await GetHeaders.getHeaders(absolutePath, pathName, etag, url, size)

    headers[HttpHeader.CacheControl] = 'public, max-age=0, must-revalidate'
    return GetContentResponse.getContentResponse(content, headers)
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return GetNotFoundResponse.getNotFoundResponse()
    }
    Logger.error(error)
    if (IsTypeScriptSyntaxError.isTypeScriptSyntaxError(error)) {
      return GetTypeScriptSyntaxErrorResponse.getTypeScriptSyntaxErrorResponse()
    }
    return GetServerErrorResponse.getServerErrorResponse()
  }
}
