import type { GetRemoteUrlOptions } from '../ExtensionHostRemoteUrlOptions/ExtensionHostRemoteUrlOptions.ts'
import * as GetRemoteUrlForWebView from '../GetRemoteUrlForWebView/GetRemoteUrlForWebView.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import * as GetProtocol from '../GetProtocol/GetProtocol.ts'

export const getRemoteUrl = async (uri: string, options: GetRemoteUrlOptions = {}): Promise<string> => {
  const protocol = GetProtocol.getProtocol(uri)
  if (Platform.platform === PlatformType.Remote && !protocol) {
    return `/remote/${uri}`
  }
  if (Platform.platform === PlatformType.Electron && !protocol) {
    return `/remote/${uri}`
  }
  if (options.webViewId) {
    return GetRemoteUrlForWebView.getRemoteUrl(uri, options)
  }
  if (uri.startsWith('html://')) {
    const url = await Rpc.invoke('Blob.getSrc', uri)
    return url
  }
  throw new Error(`unsupported platform for remote url`)
}
