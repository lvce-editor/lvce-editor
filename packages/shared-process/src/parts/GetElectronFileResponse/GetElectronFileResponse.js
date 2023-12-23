import { readFile } from 'node:fs/promises'
import * as GetElectronFileResponseAbsolutePath from '../GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.js'
import * as GetElectronFileResponseRelativePath from '../GetElectronFileResponseRelativePath/GetElectronFileResponseRelativePath.js'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as Platform from '../Platform/Platform.js'

export const getElectronFileResponse = async (url) => {
  try {
    const pathName = GetElectronFileResponseRelativePath.getElectronFileResponseRelativePath(url)
    const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(pathName)
    let content = await readFile(absolutePath)
    if (!Platform.isProduction && url === `${Platform.scheme}://-/`) {
      // @ts-ignore
      content = content.toString().replace('    <link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />\n', '')
    }
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
        },
      }
    }
  }
}
