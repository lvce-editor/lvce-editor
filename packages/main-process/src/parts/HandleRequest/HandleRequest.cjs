const ElectronSessionGetAbsolutePath = require('../ElectronSessionGetAbsolutePath/ElectronSessionGetAbsolutePath.cjs')
const GetFileResponse = require('../GetFileResponse/GetFileResponse.cjs')
const Platform = require('../Platform/Platform.cjs')

/**
 *
 * @param {GlobalRequest} request
 */

exports.handleRequest = async (request) => {
  const path = ElectronSessionGetAbsolutePath.getAbsolutePath(request.url)
  // console.time(url.toString())
  const response = await GetFileResponse.getFileResponse(path)
  if (!Platform.isProduction && request.url === `${Platform.scheme}://-/`) {
      const text = await response.text()
      const modifiedText = text.replace('    <link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />\n', '')
      // @ts-ignore
      const modifiedResponse = new Response(modifiedText, response)
      return modifiedResponse
    }
  return response
}
