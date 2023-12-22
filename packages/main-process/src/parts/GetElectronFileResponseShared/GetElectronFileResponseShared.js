import * as SharedProcess from '../SharedProcess/SharedProcess.js'

/**
 *
 * @param {string} url
 */
export const getElectronFileResponseShared = async (url) => {
  const content = await SharedProcess.invoke('GetElectronFileResponse.getElectronFileResponse', url)
  const response = new Response(content)
  return response
}
