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
    const url = pathToFileURL(path).toString()
    const response = await net.fetch(url)
    return response
  } catch (error) {
    if (IsNetFileNotFoundError.isNetFileNotFoundError(error)) {
      return new Response('not-found', {
        status: HttpStatusCode.NotFound,
        statusText: 'not-found',
      })
    }
    throw error
  }
}
