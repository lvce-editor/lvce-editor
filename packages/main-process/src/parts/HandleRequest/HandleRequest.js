import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'

/**
 *
 * @param {GlobalRequest} request
 */

export const handleRequest = (request) => {
  return GetElectronFileResponse.getElectronFileResponse(request.url)
}
