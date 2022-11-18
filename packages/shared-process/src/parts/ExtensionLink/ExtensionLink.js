import VError from 'verror'
import * as ExtensionManifest from '../ExtensionManifest/ExtensionManifest.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as SymLink from '../SymLink/SymLink.js'

const linkFallBack = async (path) => {
  try {
    const manifest = await ExtensionManifest.get(path)
    if (manifest.status === ExtensionManifestStatus.Rejected) {
      throw manifest.reason
    }
    const linkedExtensionsPath = Platform.getLinkedExtensionsPath()
    // @ts-ignore
    const to = Path.join(linkedExtensionsPath, manifest.id)
    await FileSystem.remove(to)
    await SymLink.createSymLink(path, to)
  } catch (error) {
    console.log({ error })
    throw new VError(error, `Failed to link extension`)
  }
}

export const link = async (path) => {
  try {
    const manifest = await ExtensionManifest.get(path)
    if (manifest.status === ExtensionManifestStatus.Rejected) {
      throw manifest.reason
    }
    const linkedExtensionsPath = Platform.getLinkedExtensionsPath()
    // @ts-ignore
    const to = Path.join(linkedExtensionsPath, manifest.id)
    await SymLink.createSymLink(path, to)
  } catch (error) {
    if (error && error.code === ErrorCodes.EEXIST) {
      return linkFallBack(path)
    }
    throw new VError(error, `Failed to link extension`)
  }
}
