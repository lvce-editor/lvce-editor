import * as Platform from '../Platform/Platform.js'
import * as FileSystemAppShared from './FileSystemAppShared.js'

export const readFile = () => {
  return FileSystemAppShared.readFileInternal(Platform.getUserSettingsPath)
}

export const writeFile = (content) => {
  return FileSystemAppShared.writeFileInternal(
    Platform.getUserSettingsPath,
    content
  )
}

export const readJson = () => {}

export const writeJson = (json) => {}
