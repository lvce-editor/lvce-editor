import { rm } from 'node:fs/promises'
import * as Debug from '../Debug/Debug.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import { VError } from '../VError/VError.js'

export const uninstall = async (id) => {
  try {
    Debug.debug(`ExtensionManagement#uninstall ${id}`)
    const extensionsPath = Platform.getExtensionsPath()
    await rm(Path.join(extensionsPath, id), { recursive: true })
  } catch (error) {
    // if (error.code === 'ENOENT') {
    //   return
    // }
    throw new VError(error, `Failed to uninstall extension "${id}"`)
  }
}
