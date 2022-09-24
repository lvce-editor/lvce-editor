import * as SymLink from '../SymLink/SymLink.js'
import * as Platform from '../Platform/Platform.js'
import * as Path from '../Path/Path.js'
import VError from 'verror'

export const link = async (path) => {
  try {
    const extensionsPath = Platform.getExtensionsPath()
    console.log({ path, extensionsPath })
    const baseName = Path.basename(path)
    const to = Path.join(extensionsPath, baseName)
    await SymLink.createSymLink(path, to)
  } catch (error) {
    throw new VError(error, `Failed to link extension`)
  }
}
