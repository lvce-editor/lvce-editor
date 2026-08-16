import { resolve, sep } from 'node:path'
import * as Command from '@lvce-editor/command'
import * as Assert from '../Assert/Assert.js'
import * as ImportScript from '../ImportScript/ImportScript.js'
import { VError } from '../VError/VError.js'

export const resolveRemoteExtensionPath = (value, extensionsPath = process.env.LVCE_REMOTE_EXTENSIONS_PATH) => {
  if (!extensionsPath) {
    return value
  }
  const normalized = value.replaceAll('\\', '/')
  const marker = '/extensions/'
  const markerIndex = normalized.lastIndexOf(marker)
  if (markerIndex === -1) {
    return value
  }
  const relativePath = normalized.slice(markerIndex + marker.length)
  const root = resolve(extensionsPath)
  const resolved = resolve(root, relativePath)
  if (resolved !== root && !resolved.startsWith(`${root}${sep}`)) {
    throw new Error('Remote extension path escapes the built-in extensions directory')
  }
  return resolved
}

export const loadFile = async (path) => {
  try {
    Assert.string(path)
    const resolvedPath = resolveRemoteExtensionPath(path)
    const module = await ImportScript.importScript(resolvedPath)
    if (module && module.commandMap) {
      const commandMap = module.commandMap
      Command.register(commandMap)
    } else if (module && module.execute) {
      throw new Error(`execute function is not supported anymore. Use commandMap instead`)
    } else {
      throw new Error(`missing export const execute function`)
    }
  } catch (error) {
    throw new VError(error, `Failed to load ${path}`)
  }
}
