import * as Platform from '../Platform/Platform.js'
import * as Command from '../Command/Command.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Languages from '../Languages/Languages.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

export const state = {
  /**
   * @type {any[]}
   */
  webExtensions: [],
}

const getId = (path) => {
  const slashIndex = path.lastIndexOf('/')
  return path.slice(slashIndex + 1)
}

const getWebExtensionManifest = async (path) => {
  try {
    const manifestPath = `${path}/extension.json`
    const manifest = await Command.execute(
      /* Ajax.getJson */ 'Ajax.getJson',
      /* url */ manifestPath
    )
    return {
      ...manifest,
      path,
    }
  } catch (error) {
    const id = getId(path)
    throw new Error(`Failed to load extension manifest for ${id}`, {
      // @ts-ignore
      cause: error,
    })
  }
}

export const addWebExtension = async (path) => {
  const manifest = await getWebExtensionManifest(path)
  state.webExtensions.push(manifest)
  console.log({ manifest })
  if (manifest.languages) {
    // TODO handle case when languages is not of type array
    await Languages.addLanguages(manifest.languages)
  }
}

const getSharedProcessExtensions = () => {
  return SharedProcess.invoke(
    /* ExtensionManagement.getExtensions */ 'ExtensionManagement.getExtensions'
  )
}

export const getExtensions = async () => {
  if (Platform.getPlatform() === 'web') {
    return state.webExtensions
  }
  if (Platform.getPlatform() === 'remote') {
    const sharedProcessExtensions = await getSharedProcessExtensions()
    return [...sharedProcessExtensions, ...state.webExtensions]
  }
  const extensions = await getSharedProcessExtensions()
  return extensions
}
