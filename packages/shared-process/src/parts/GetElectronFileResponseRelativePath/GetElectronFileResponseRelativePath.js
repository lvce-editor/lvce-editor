import * as Platform from '../Platform/Platform.js'

const { scheme } = Platform
const prefix = `${scheme}://-`
const prefixLength = prefix.length

export const getElectronFileResponseRelativePath = (requestUrl) => {
  if (requestUrl.startsWith('/')) {
    return requestUrl
  }
  const decoded = decodeURI(requestUrl)
  const pathName = decoded.slice(prefixLength)
  return pathName
}
