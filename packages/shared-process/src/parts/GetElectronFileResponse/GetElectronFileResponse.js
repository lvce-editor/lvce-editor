import { stat } from 'fs/promises'
import * as GetElectronFileResponseAbsolutePath from '../GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.js'
import * as GetElectronFileResponseContent from '../GetElectronFileResponseContent/GetElectronFileResponseContent.js'
import * as GetElectronFileResponseRelativePath from '../GetElectronFileResponseRelativePath/GetElectronFileResponseRelativePath.js'
import * as GetEtag from '../GetEtag/GetEtag.js'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as GetNotFoundResponse from '../GetNotFoundResponse/GetNotFoundResponse.js'
import * as GetNotModifiedResponse from '../GetNotModifiedResponse/GetNotModifiedResponse.js'
import * as GetServerErrorResponse from '../GetServerErrorResponse/GetServerErrorResponse.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as Logger from '../Logger/Logger.js'

export const getElectronFileResponse = async (url, request) => {
  try {
    const pathName = GetElectronFileResponseRelativePath.getElectronFileResponseRelativePath(url)
    const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(pathName)
    let etag
    if (request) {
      const stats = await stat(absolutePath)
      etag = GetEtag.getEtag(stats)
      if (request.headers['if-none-match'] === etag) {
        return GetNotModifiedResponse.getNotModifiedResponse()
      }
    }
    const content = await GetElectronFileResponseContent.getElectronFileResponseContent(request, absolutePath, url)
    const headers = GetHeaders.getHeaders(absolutePath, pathName)
    headers['Cache-Control'] = 'public, max-age=0, must-revalidate'
    if (etag) {
      headers['Etag'] = etag
    }
    return {
      body: content,
      init: {
        status: HttpStatusCode.Ok,
        headers,
      },
    }
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return GetNotFoundResponse.getNotFoundResponse()
    }
    Logger.error(error)
    return GetServerErrorResponse.getServerErrorResponse()
  }
}
