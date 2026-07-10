import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as GetRemoteUrl from '../GetRemoteUrl/GetRemoteUrl.ts'

export const getWebViewsFromExtensions = (extensions: any): any => {
  const webViews: any[] = []
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
          remotePath,
          uri,
        })
      }
    }
  }
  return webViews
}
