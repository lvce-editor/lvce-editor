import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Scheme from '../Scheme/Scheme.ts'

export const getWebViewOrigin = (webViewPort: any): string => {
  // TODO don't hardcode protocol
  let origin = ''
  if (Platform.platform === PlatformType.Electron) {
    origin = `${Scheme.WebView}://-/`
  } else if (Platform.platform === PlatformType.Remote) {
    origin = `http://localhost:${webViewPort}`
  } else {
    origin = '*' // TODO
  }
  return origin
}
