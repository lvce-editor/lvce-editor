import * as Command from '../Command/Command.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as Platform from '../Platform/Platform.js'
import * as DirentType from '../DirentType/DirentType.js'

export const canBeRestored = true

export const name = 'Fetch'

export const state = {
  files: Object.create(null),
}

export const readFile = async (uri) => {
  const assetDir = Platform.getAssetDir()
  const fetchUri = `${assetDir}${uri}`
  const text = await Command.execute('Ajax.getText', fetchUri)
  return text
}

export const writeFile = (uri, content) => {
  throw new Error('not implemented')
}

export const mkdir = (uri) => {
  throw new Error('not implemented')
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}

export const remove = (uri) => {
  throw new Error('not implemented')
}

export const readDirWithFileTypes = async (uri) => {
  const assetDir = Platform.getAssetDir()
  const fetchUri = `${assetDir}/config/fileMap.json`
  const fileList = await Command.execute('Ajax.getJson', fetchUri)
  const dirents = []
  for (const fileUri of fileList) {
    if (fileUri.startsWith(uri)) {
      const rest = fileUri.slice(uri.length + 1)
      if (rest.includes('/')) {
        const name = rest.slice(0, rest.indexOf('/'))
        if (dirents.some((dirent) => dirent.name === name)) {
          continue
        }
        dirents.push({
          type: DirentType.Directory,
          name,
        })
      } else {
        dirents.push({
          type: DirentType.File,
          name: rest,
        })
      }
    }
  }
  return dirents
}

export const chmod = (path, permissions) => {
  throw new Error('[memfs] chmod not implemented')
}
