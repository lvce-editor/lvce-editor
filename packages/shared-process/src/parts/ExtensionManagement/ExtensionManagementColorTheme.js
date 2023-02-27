import * as Assert from '../Assert/Assert.js'
import * as Error from '../Error/Error.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as FileSystemWatch from '../FileSystemWatch/FileSystemWatch.js'
import * as ReadJson from '../JsonFile/JsonFile.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as Path from '../Path/Path.js'
import * as Process from '../Process/Process.js'
import { VError } from '../VError/VError.js'
import * as ExtensionManagement from './ExtensionManagement.js'

// TODO test this function
// TODO very similar with getIconTheme

const getColorThemePath = async (extensions, colorThemeId) => {
  for (const extension of extensions) {
    if (!extension.colorThemes) {
      continue
    }
    for (const colorTheme of extension.colorThemes) {
      if (colorTheme.id !== colorThemeId) {
        continue
      }
      const absolutePath = Path.join(extension.path, colorTheme.path)
      return absolutePath
    }
  }
  return ''
}

export const getColorThemeJson = async (colorThemeId) => {
  Assert.string(colorThemeId)
  const extensions = await ExtensionManagement.getExtensions()
  const colorThemePath = await getColorThemePath(extensions, colorThemeId)
  if (!colorThemePath) {
    throw new Error.OperationalError({
      code: ErrorCodes.E_COLOR_THEME_NOT_FOUND,
      message: `Color theme "${colorThemeId}" not found in extensions folder`,
    })
  }
  try {
    const json = await ReadJson.readJson(colorThemePath)
    return json
  } catch (error) {
    throw new VError(error, `Failed to load color theme "${colorThemeId}"`)
  }
}

const getColorThemeInfo = (extension) => {
  return extension.colorThemes || []
}

const getExtensionColorThemeNames = (extension) => {
  return extension.colorThemes || []
}

const getColorThemeId = (colorTheme) => {
  return colorTheme.id
}

// TODO should send names to renderer worker or names with ids?
export const getColorThemeNames = async () => {
  const extensions = await ExtensionManagement.getExtensions()
  const colorThemes = extensions.flatMap(getExtensionColorThemeNames)
  const colorThemeNames = colorThemes.map(getColorThemeId)
  return colorThemeNames
}

export const getColorThemes = async () => {
  const extensions = await ExtensionManagement.getExtensions()
  const colorThemes = extensions.flatMap(getColorThemeInfo)
  return colorThemes
}

export const watch = async (socket, colorThemeId) => {
  // console.log({ socket, colorThemeId })
  const extensions = await ExtensionManagement.getExtensions()
  const colorThemePath = await getColorThemePath(extensions, colorThemeId)
  const verbose = Process.argv.includes('--verbose')
  if (verbose) {
    console.info(`[shared-process] starting to watch color theme ${colorThemeId} at ${colorThemePath}`)
  }
  const watcher = FileSystemWatch.watchFile(colorThemePath)
  for await (const event of watcher) {
    socket.send({ jsonrpc: JsonRpcVersion.Two, method: 'ColorTheme.reload', params: [] })
  }
}
