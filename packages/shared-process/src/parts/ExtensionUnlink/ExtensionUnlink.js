import VError from 'verror'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'

export const unlink = async (path) => {
  try {
    const manifestPath = Path.join(path, 'extension.json')
    if (!(await FileSystem.exists(manifestPath))) {
      throw new Error('no extension manifest found')
    }
    const linkedExtensionsPath = Platform.getLinkedExtensionsPath()
    const baseName = Path.basename(path)
    const to = Path.join(linkedExtensionsPath, baseName)
    await FileSystem.remove(to)
  } catch (error) {
    throw new VError(error, `Failed to unlink extension`)
  }
}
