import * as Platform from '../Platform/Platform.js'
import * as FileSystemAppShared from './FileSystemAppShared.js'

const defaultContent = '{}'

export const readFile = () => {
  return FileSystemAppShared.readFileInternal(Platform.getUserKeyBindingsPath, defaultContent)
}

export const writeFile = (content) => {
  return FileSystemAppShared.writeFileInternal(Platform.getUserKeyBindingsPath, content)
}

export const readJson = () => {}

export const writeJson = (json) => {}
