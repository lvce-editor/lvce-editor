import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getWebViewsWeb = async () => {
  if (Platform.platform !== PlatformType.Web) {
    return []
  }
  const webViews = await SharedProcess.invoke('ExtensionHost.getWebViews')
  return webViews
}
