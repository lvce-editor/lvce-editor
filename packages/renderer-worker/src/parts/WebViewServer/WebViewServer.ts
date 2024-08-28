import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const create = async (previewServerId: number) => {
  await SharedProcess.invoke('WebViewServer.create', previewServerId)
}

export const start = async (previewServerId: number, webViewPort: number) => {
  await SharedProcess.invoke('WebViewServer.start', previewServerId, webViewPort)
}

export const setHandler = async (previewServerId: number, frameAncestors: string, webViewRoot: string) => {
  await SharedProcess.invoke('WebViewServer.setHandler', previewServerId, frameAncestors, webViewRoot)
}
