import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WebViews from '../WebViews/WebViews.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

const getWebViewsNode = async () => {
  if (Platform.platform === PlatformType.Web) {
    return []
  }
  const webViews = await SharedProcess.invoke('ExtensionHost.getWebViews')
  return webViews
}

export const getWebViews = async () => {
  const nodeWebViews = await getWebViewsNode()
  const registeredWebViews = WebViews.get()
  const allWebViews = [...nodeWebViews, ...registeredWebViews]
  return allWebViews
}
