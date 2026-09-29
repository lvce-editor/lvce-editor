import { access, rm } from 'node:fs/promises'
import * as Path from '../Path/Path.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as Trash from '../Trash/Trash.ts'
import { VError } from '../VError/VError.ts'

export const uninstall = async (id: any): Promise<any> => {
  const extensionsPath = PlatformPaths.getExtensionsPath()
  const extensionPath = Path.join(extensionsPath, id)
  try {
    await access(extensionPath)
  } catch (error) {
    throw new VError(error, `Failed to uninstall extension "${id}"`)
  }
  try {
    await Trash.trash(extensionPath)
    return
  } catch {
    // Fall back to permanent deletion when the platform trash is unavailable.
  }
  try {
    await rm(extensionPath, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to uninstall extension "${id}"`)
  }
}
