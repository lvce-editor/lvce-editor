import * as GetWebViews from '../GetWebViews/GetWebViews.ts'

export const create = (id, uri) => {
  return {
    id,
    uri,
  }
}

export const loadContent = async (state) => {
  const { uri } = state
  const webViewId = uri.slice('webview://'.length)
  const webViews = await GetWebViews.getWebViews()
  console.log({ webViews })
  // await ExtensionHostManagement.activateByEvent(`onWebView:${webViewId}`)
  // await ExtensionHostWorker.invoke
  return state
}
