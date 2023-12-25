import * as SharedProcess from '../SharedProcess/SharedProcess.js'

/**
 *
 * @param {string} url
 */
export const getElectronFileResponse = async (url) => {
  const { body, init } = await SharedProcess.invoke('GetElectronFileResponse.getElectronFileResponse', url)
  const response = new Response(body, init)
  return response
}
