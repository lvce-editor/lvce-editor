import * as GetWebViewsNode from '../GetWebViewsNode/GetWebViewsNode.ts'
import * as GetWebViewsWeb from '../GetWebViewsWeb/GetWebViewsWeb.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as WebViews from '../WebViews/WebViews.ts'

const getWebViewsDefault = async () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Web:
      return GetWebViewsWeb.getWebViewsWeb()
    case PlatformType.Test:
      return []
    default:
      return GetWebViewsNode.getWebViewsNode()
  }
}

export const getWebViews = async () => {
  const nodeWebViews = await getWebViewsDefault()
  const registeredWebViews = WebViews.get()
  const allWebViews = [...nodeWebViews, ...registeredWebViews]
  return allWebViews
}
