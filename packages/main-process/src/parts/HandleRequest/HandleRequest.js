import * as GetElectronFileResponseShared from '../GetElectronFileResponseShared/GetElectronFileResponseShared.js'

/**
 *
 * @param {GlobalRequest} request
 */
export const handleRequest = (request) => {
  return GetElectronFileResponseShared.getElectronFileResponseShared(request.url)
}
