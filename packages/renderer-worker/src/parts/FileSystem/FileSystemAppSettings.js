import * as Platform from '../Platform/Platform.js'
import { VError } from '../VError/VError.js'
import * as FileSystemAppShared from './FileSystemAppShared.js'

const defaultContent = '{}'

export const readFile = async () => {
  return await FileSystemAppShared.readFileInternal(Platform.getUserSettingsPath, defaultContent)
}

export const writeFile = async (content) => {
  return await FileSystemAppShared.writeFileInternal(Platform.getUserSettingsPath, content)
}

export const readJson = () => {}

export const writeJson = (json) => {}
