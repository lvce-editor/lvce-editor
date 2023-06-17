const { existsSync } = require('node:fs')
const { join } = require('node:path')
const ElectronSessionGetAbsolutePath = require('../ElectronSessionGetAbsolutePath/ElectronSessionGetAbsolutePath.js')
const HttpStatusCode = require('../HttpStatusCode/HttpStatusCode.js')

/**
 *
 * @param {globalThis.Electron.ProtocolRequest} request
 */

exports.handleRequest = (request, callback) => {
  // const path = join(__dirname, request.url.slice(6))
  const path = ElectronSessionGetAbsolutePath.getAbsolutePath(request.url)
  if (!existsSync(path)) {
    // TODO doing this for every request is really slow
    // but without this, fetch would not received a response for 404 requests
    return callback({
      statusCode: HttpStatusCode.NotFound,
      path: join(__dirname, 'not-found.txt'),
    })
  }
  callback({
    path,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable', // TODO caching is not working, see https://github.com/electron/electron/issues/27075 and https://github.com/electron/electron/issues/23482
    },
  })
}
