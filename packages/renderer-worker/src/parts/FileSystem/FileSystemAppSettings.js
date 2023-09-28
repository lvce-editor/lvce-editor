import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as FileSystemAppShared from './FileSystemAppShared.js'

const defaultContent = '{}'

export const readFile = () => {
  return FileSystemAppShared.readFileInternal(PlatformPaths.getUserSettingsPath, defaultContent)
}

export const writeFile = (content) => {
  return FileSystemAppShared.writeFileInternal(PlatformPaths.getUserSettingsPath, content)
}

export const readJson = () => {}

export const writeJson = (json) => {}
