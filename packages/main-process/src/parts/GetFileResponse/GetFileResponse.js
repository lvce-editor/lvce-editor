const { net } = require('electron')
const { pathToFileURL } = require('node:url')
const HttpStatusCode = require('../HttpStatusCode/HttpStatusCode.js')
const IsNetFileNotFoundError = require('../IsNetFileNotFoundError/IsNetFileNotFoundError.js')

/**
 *
 * @param {string} path
 * @returns {Promise<GlobalResponse>}
 */
exports.getFileResponse = async (path) => {
  try {
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
