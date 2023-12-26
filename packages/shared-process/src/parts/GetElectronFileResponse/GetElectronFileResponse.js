import * as GetElectronFileResponseAbsolutePath from '../GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.js'
import * as GetElectronFileResponseContent from '../GetElectronFileResponseContent/GetElectronFileResponseContent.js'
import * as GetElectronFileResponseRelativePath from '../GetElectronFileResponseRelativePath/GetElectronFileResponseRelativePath.js'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as Logger from '../Logger/Logger.js'

export const getElectronFileResponse = async (url) => {
  try {
    const pathName = GetElectronFileResponseRelativePath.getElectronFileResponseRelativePath(url)
    const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(pathName)
    const content = await GetElectronFileResponseContent.getElectronFileResponseContent(absolutePath, url)
    const headers = GetHeaders.getHeaders(absolutePath)
    return {
      body: content,
      init: {
        status: HttpStatusCode.Ok,
        headers,
      },
    }
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return {
        body: 'not-found',
        init: {
          status: HttpStatusCode.NotFound,
          statusText: 'not-found',
          headers: {},
        },
      }
    }
    Logger.error(error)
    return {
      body: 'server-error',
      init: {
        status: HttpStatusCode.ServerError,
        statusText: 'server-error',
      },
    }
  }
}
