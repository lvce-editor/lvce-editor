import * as Platform from '../Platform/Platform.js'
import * as Command from '../Command/Command.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Languages from '../Languages/Languages.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import { VError } from '../VError/VError.js'

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
    throw new VError(error, `Failed to load extension manifest for ${id}`)
  }
}

export const addWebExtension = async (path) => {
  const manifest = await getWebExtensionManifest(path)
  // TODO avoid side effect here
  if (manifest.languages) {
    for (const language of manifest.languages) {
      if (language.tokenize) {
        language.tokenize = manifest.path + '/' + language.tokenize
      }
    }
  }
  console.log({ manifest })
  state.webExtensions.push(manifest)
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

export const addNodeExtension = async (path) => {
  // TODO add support for dynamically loading node extensions
  // e.g. for testing multiple extensions
  throw new Error('not implemented')
}
