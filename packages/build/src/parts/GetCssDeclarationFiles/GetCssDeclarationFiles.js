import { access, readdir } from 'fs/promises'
import * as Path from '../Path/Path.js'

const isViewletDirent = (dirent) => {
  return dirent.startsWith('Viewlet')
}

const exists = async (path) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export const getCssDeclarationFiles = async (cachePath) => {
  const partsPath = Path.join(cachePath, `src/parts`)
  const dirents = await readdir(partsPath)
  const viewletDirents = dirents.filter(isViewletDirent)
  const results = []
  for (const dirent of viewletDirents) {
    const relativePathCandidates = [`src/parts/${dirent}/${dirent}Css.js`, `src/parts/${dirent}/${dirent}Css.ts`]
    for (const relativePath of relativePathCandidates) {
      const cssPath = Path.join(cachePath, relativePath)
      if (await exists(cssPath)) {
        results.push(cssPath)
      }
    }
  }
  return results
}
