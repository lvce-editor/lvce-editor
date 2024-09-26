import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

// TODO names this method
// - getRemoteUrl
// - getBlobUrl
// - getObjectUrl
// - FileSystem.readAsBlob

// TODO when returning an objectUrl in web, provide a way to dispose the object url

export const getRemoteUrl = (uri: string) => {
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
