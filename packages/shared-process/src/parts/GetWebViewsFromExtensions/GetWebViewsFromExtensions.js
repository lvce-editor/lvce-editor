import { join } from 'node:path'
import * as GetRemoteUrl from '../GetRemoteUrl/GetRemoteUrl.js'
import { pathToFileURL } from 'node:url'

export const getWebViewsFromExtensions = (extensions) => {
  const webViews = []
  for (const extension of extensions) {
    if (extension && extension.webViews) {
      for (const webView of extension.webViews) {
        let path = extension.path
        if (webView && webView.path) {
          path = join(extension.path, webView.path)
        }
        const uri = pathToFileURL(path).toString()
        const remotePath = GetRemoteUrl.getRemoteUrl(path)
        webViews.push({
          ...webView,
          path,
          uri,
          remotePath,
        })
      }
    }
  }
  return webViews
}
