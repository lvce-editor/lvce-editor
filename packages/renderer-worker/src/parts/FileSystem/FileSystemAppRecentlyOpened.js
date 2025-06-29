import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as FileSystemAppShared from './FileSystemAppShared.js'

export const writeFile = (content) => {
  return FileSystemAppShared.writeFileInternal(PlatformPaths.getRecentlyOpenedPath, content)
}

export const readFile = () => {
  return FileSystemAppShared.readFileInternal(PlatformPaths.getRecentlyOpenedPath)
}

export const readJson = () => {
  return FileSystemAppShared.readJsonInternal(PlatformPaths.getRecentlyOpenedPath)
}
