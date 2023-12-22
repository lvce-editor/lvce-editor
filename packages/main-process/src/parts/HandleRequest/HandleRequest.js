import * as ElectronSessionGetAbsolutePath from '../ElectronSessionGetAbsolutePath/ElectronSessionGetAbsolutePath.js'
import * as GetFileResponse from '../GetFileResponse/GetFileResponse.js'
import * as GetRelativePath from '../GetRelativePath/GetRelativePath.js'
import * as Platform from '../Platform/Platform.js'

/**
 *
 * @param {GlobalRequest} request
 */

export const handleRequest = async (request) => {
  const pathName = GetRelativePath.getRelativePath(request.url)
  const path = ElectronSessionGetAbsolutePath.getAbsolutePath(pathName)
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
