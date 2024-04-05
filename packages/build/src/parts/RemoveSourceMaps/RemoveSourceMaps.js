import { VError } from '@lvce-editor/verror'
import { existsSync } from 'fs'
import { readdir } from 'fs/promises'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'

export const removeSourceMaps = async (absolutePath) => {
  try {
    const dirents = await readdir(absolutePath, { recursive: true })
    for (const dirent of dirents) {
      const absoluteDirentPath = Path.join(absolutePath, dirent)
      if (dirent.endsWith('.js')) {
        const sourceMapPath = absoluteDirentPath + '.map'
        if (!existsSync(sourceMapPath)) {
          continue
        }
        await Remove.remove(sourceMapPath)
        const baseName = Path.baseName(sourceMapPath)
        await Replace.replace({
          path: absoluteDirentPath,
          occurrence: `//# sourceMappingURL=${baseName}`,
          replacement: '',
        })
      }
    }
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return
    }
    throw new VError(error, `failed to remove source maps`)
  }
}
