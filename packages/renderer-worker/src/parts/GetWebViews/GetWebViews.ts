import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getWebViewsNode = async () => {
  const webViews = await SharedProcess.invoke('ExtensionHost.getWebViews')
  return webViews
}

export const getWebViews = async () => {
  const webViews = await getWebViewsNode()
  const allWebViews = [...webViews]
  return allWebViews
}
