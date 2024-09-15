import * as SharedProcess from '../SharedProcess/SharedProcess.js'

/**
 *
 * @param {string} url
 * @param {any} request
 */
export const getElectronFileResponse = async (url, request) => {
  const { body, init } = await SharedProcess.invoke('GetElectronFileResponse.getElectronFileResponse', url, request)
  const response = new Response(body, init)
  return response
}
