import { net } from 'electron'
import { pathToFileURL } from 'node:url'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as IsNetFileNotFoundError from '../IsNetFileNotFoundError/IsNetFileNotFoundError.js'

/**
 *
 * @param {string} path
 * @returns {Promise<GlobalResponse>}
 */
export const getFileResponse = async (path) => {
  try {
    const isTypeScript = path.endsWith('.ts')
    if (isTypeScript) {
      const GetFileResponseTypeScript = await import('../GetFileResponseTypeScript/GetFileResponseTypeScript.js')
      return await GetFileResponseTypeScript.getFileResponseTypeScript(path)
    }
    const url = pathToFileURL(path)
    const response = await net.fetch(url)
    return response
  } catch (error) {
    if (IsNetFileNotFoundError.isNetFileNotFoundError(error)) {
      // @ts-ignore
      return new Response('not-found', {
        status: HttpStatusCode.NotFound,
        statusText: 'not-found',
      })
    }
    throw error
  }
}
