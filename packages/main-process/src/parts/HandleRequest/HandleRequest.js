import * as GetElectronFileResponse from '../GetElectronFileResponse/GetElectronFileResponse.js'
import * as SerializeRequest from '../SerializeRequest/SerializeRequest.js'

/**
 *
 * @param {GlobalRequest} request
 */
export const handleRequest = (request) => {
  const serialized = SerializeRequest.serializeRequest(request)
  return GetElectronFileResponse.getElectronFileResponse(request.url, serialized)
}
