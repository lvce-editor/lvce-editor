import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

// TODO names this method
// - getRemoteUrl
// - getBlobUrl
// - getObjectUrl
// - FileSystem.readAsBlob

// TODO when returning an objectUrl in web, provide a way to dispose the object url

interface GetRemoteUrlOptions {
  readonly webViewId?: string
}

export const getRemoteUrl = async (uri: string, options: GetRemoteUrlOptions = {}) => {
  // TODO if webViewId is provided,
  // 1. read file as blob
  // 2. send blob to webview
  // 3. create objecturl in webview
  // 4. send back objecturl to extension host worker
  // 5. provide objectUrl to extension

  if (uri.startsWith('html://')) {
    const url = await Rpc.invoke('Blob.getSrc', uri)
    return url
  }
  if (Platform.platform === PlatformType.Remote) {
    // TODO support custom file system protocols
    return `/remote/${uri}`
  }
  if (Platform.platform === PlatformType.Electron) {
    // TODO
    return `/remote/${uri}`
  }
  throw new Error(`unsupported platform`)
}
