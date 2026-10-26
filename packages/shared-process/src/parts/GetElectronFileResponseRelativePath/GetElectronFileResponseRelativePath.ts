import * as Platform from '../Platform/Platform.ts'
import { removeQueryParameters } from '../RemoveQueryParameters/RemoveQueryParameters.ts'
import * as Scheme from '../Scheme/Scheme.ts'

const { scheme } = Platform
const prefix = `${scheme}://-`
const prefixLength = prefix.length

const webViewPrefix = `${Scheme.WebView}://-`
const webViewPrefixLength = webViewPrefix.length

const decodePathName = (pathName: string): string => {
  // Remote paths remain file-URL encoded until fileURLToPath decodes them once.
  return pathName.startsWith('/remote/') ? pathName : decodeURI(pathName)
}

export const getElectronFileResponseRelativePath = (requestUrl: any): any => {
  if (requestUrl.startsWith(prefix)) {
    // TODO only support reading from app root and extensions
    // maybe add a separate protocol for extensions (e.g. lvce-remote)
    return decodePathName(requestUrl.slice(prefixLength))
  }
  if (requestUrl.startsWith(webViewPrefix)) {
    // TODO group this by extension so that
    // extension-a can only access resources in extension-a folder and
    // extension-b can only access resources in extension-b folder
    return decodePathName(requestUrl.slice(webViewPrefixLength))
  }
  if (requestUrl.startsWith('/')) {
    // TODO this should not be supported anymore and could probably be removed
    const pathName = removeQueryParameters(requestUrl)
    return decodePathName(pathName)
  }
  console.log({ requestUrl })
  return ''
}
