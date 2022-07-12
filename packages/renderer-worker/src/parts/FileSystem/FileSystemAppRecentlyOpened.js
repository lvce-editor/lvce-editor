import * as FileSystemAppShared from './FileSystemAppShared.js'
import * as Platform from '../Platform/Platform.js'

export const writeFile = (content) => {
  return FileSystemAppShared.writeFileInternal(
    Platform.getRecentlyOpenedPath,
    content
  )
}

export const readFile = () => {
  return FileSystemAppShared.readFileInternal(Platform.getRecentlyOpenedPath)
}
