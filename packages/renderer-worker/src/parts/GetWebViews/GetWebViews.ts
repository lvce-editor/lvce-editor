import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WebViews from '../WebViews/WebViews.ts'

const getWebViewsNode = async () => {
  const webViews = await SharedProcess.invoke('ExtensionHost.getWebViews')
  return webViews
}

export const getWebViews = async () => {
  const nodeWebViews = await getWebViewsNode()
  const registeredWebViews = WebViews.get()
  const allWebViews = [...nodeWebViews, registeredWebViews]
  return allWebViews
}
