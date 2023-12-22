import * as GetElectronFileResponseShared from '../GetElectronFileResponseShared/GetElectronFileResponseShared.js'

const getFileResponse = GetElectronFileResponseShared.getElectronFileResponseShared

/**
 *
 * @param {GlobalRequest} request
 */
export const handleRequest = (request) => {
  return getFileResponse(request.url)
}
