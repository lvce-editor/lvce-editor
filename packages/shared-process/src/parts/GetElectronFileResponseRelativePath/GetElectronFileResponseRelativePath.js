import * as Platform from '../Platform/Platform.js'
import { removeQueryParameters } from '../RemoveQueryParameters/RemoveQueryParameters.js'
import * as Scheme from '../Scheme/Scheme.js'

const { scheme } = Platform
const prefix = `${scheme}://-`
const prefixLength = prefix.length

const webViewPrefix = `${Scheme.WebView}://-`
const webViewPrefixLength = webViewPrefix.length

export const getElectronFileResponseRelativePath = (requestUrl) => {
  if (requestUrl.startsWith(prefix)) {
    // TODO only support reading from app root and extensions
    // maybe add a separate protocol for extensions (e.g. lvce-remote)
    const decoded = decodeURI(requestUrl)
    const pathName = decoded.slice(prefixLength)
    return pathName
  }
  if (requestUrl.startsWith(webViewPrefix)) {
    // TODO group this by extension so that
    // extension-a can only access resources in extension-a folder and
    // extension-b can only access resources in extension-b folder
    const decoded = decodeURI(requestUrl)
    const pathName = decoded.slice(webViewPrefixLength)
    return pathName
  }
  if (requestUrl.startsWith('/')) {
    // TODO this should not be supported anymore and could probably be removed
    return removeQueryParameters(requestUrl)
  }
  console.log({ requestUrl })
  return ''
}
