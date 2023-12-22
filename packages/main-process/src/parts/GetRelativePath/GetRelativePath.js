import * as Platform from '../Platform/Platform.js'

export const getRelativePath = (requestUrl) => {
  const decoded = decodeURI(requestUrl)
  const { scheme } = Platform
  const pathName = decoded.slice(`${scheme}://-`.length)
  return pathName
}
