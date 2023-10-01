import { rm } from 'node:fs/promises'
import * as Debug from '../Debug/Debug.js'
import * as Path from '../Path/Path.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import { VError } from '../VError/VError.js'

export const uninstall = async (id) => {
  try {
    Debug.debug(`ExtensionManagement#uninstall ${id}`)
    const extensionsPath = PlatformPaths.getExtensionsPath()
    await rm(Path.join(extensionsPath, id), { recursive: true })
  } catch (error) {
    // if (error.code === 'ENOENT') {
    //   return
    // }
    throw new VError(error, `Failed to uninstall extension "${id}"`)
  }
}
