const ElectronSessionGetAbsolutePath = require('../ElectronSessionGetAbsolutePath/ElectronSessionGetAbsolutePath.js')
const GetFileResponse = require('../GetFileResponse/GetFileResponse.js')

/**
 *
 * @param {globalThis.Electron.ProtocolRequest} request
 */

exports.handleRequest = async (request) => {
  // console.log('url', request.url)
  const path = ElectronSessionGetAbsolutePath.getAbsolutePath(request.url)
  // console.time(url.toString())
  const response = await GetFileResponse.getFileResponse(path)
  // console.timeEnd(url.toString())
  return response
}

exports.handleRequestFile = (request, callback) => {
  const path = ElectronSessionGetAbsolutePath.getAbsolutePath(request.url)
  callback(path)
}
