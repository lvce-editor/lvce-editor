import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as FileSystemAppShared from './FileSystemAppShared.js'

const defaultContent = '{}'

export const readFile = () => {
  return FileSystemAppShared.readFileInternal(PlatformPaths.getUserKeyBindingsPath, defaultContent)
}

export const writeFile = async (content) => {
  await FileSystemAppShared.writeFileInternal(PlatformPaths.getUserKeyBindingsPath, content)
  const KeyBindings = await import('../KeyBindings/KeyBindings.js')
  await KeyBindings.reloadUserKeyBindings()
}

export const readJson = () => {}

export const writeJson = (json) => {}
