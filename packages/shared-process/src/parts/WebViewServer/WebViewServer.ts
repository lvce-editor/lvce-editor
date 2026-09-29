import * as PreviewProcess from '../PreviewProcess/PreviewProcess.ts'
import * as RegisterWebViewProtocol from '../RegisterWebViewProtocol/RegisterWebViewProtocol.ts'

export const registerProtocol = RegisterWebViewProtocol.registerWebViewProtocol

export const create = async (...args: any): Promise<any> => {
  await PreviewProcess.invoke('WebViewServer.create', ...args)
}

export const start = async (previewId: any, port: any): Promise<any> => {
  await PreviewProcess.invoke('WebViewServer.start', previewId, port)
}

export const setHandler = async (
  previewId: any,
  frameAncestors: any,
  webViewRoot: any,
  contentSecurityPolicy: any,
  iframeContent: any,
): Promise<any> => {
  await PreviewProcess.invoke('WebViewServer.setHandler', previewId, frameAncestors, webViewRoot, contentSecurityPolicy, iframeContent)
}

export const setInfo = async (...args: any): Promise<any> => {
  await PreviewProcess.invoke('WebViewServer.setInfo', ...args)
}

export const setInfo2 = async (...args: any): Promise<any> => {
  await PreviewProcess.invoke('WebViewServer.setInfo2', ...args)
}
