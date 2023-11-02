import { readdir } from 'fs/promises'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'
import { existsSync } from 'fs'

export const removeSourceMaps = async (absolutePath) => {
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
}
