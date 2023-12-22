import * as Flags from '../Flags/Flags.js'
import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'
import * as GetElectronFileResponseShared from '../GetElectronFileResponseShared/GetElectronFileResponseShared.js'

const getFileResponse = Flags.UseSharedProcessFileResponse
  ? GetElectronFileResponseShared.getElectronFileResponseShared
  : GetElectronFileResponse.getElectronFileResponse

/**
 *
 * @param {GlobalRequest} request
 */
export const handleRequest = (request) => {
  return getFileResponse(request.url)
}
