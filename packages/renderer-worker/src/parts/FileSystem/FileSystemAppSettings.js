import * as FileSystemAppShared from './FileSystemAppShared.js'
import * as Platform from '../Platform/Platform.js'

export const readFile = () => {
  return FileSystemAppShared.readFileInternal(Platform.getUserSettingsPath)
}

export const writeFile = (content) => {
  return FileSystemAppShared.writeFileInternal(
    Platform.getUserSettingsPath,
    content
  )
}
