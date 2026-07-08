import * as ExtensionKeyBindings from '../ExtensionKeyBindings/ExtensionKeyBindings.js'
import * as Logger from '../Logger/Logger.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const getViewletKeyBindings = async (module) => {
  if (module.getKeyBindings) {
    try {
      return await module.getKeyBindings()
    } catch (error) {
      Logger.warn(`Failed to load keybindings for ${module.name}: ${error}`)
    }
  }
  return []
}

const getExtensionKeyBindings = async () => {
  try {
    return await ExtensionKeyBindings.getKeyBindings()
  } catch (error) {
    Logger.warn(`Failed to load extension keybindings: ${error}`)
    return []
  }
}

const maybeLoad = async (id) => {
  try {
    return await ViewletModule.load(id)
  } catch {
    return {}
  }
}

export const getKeyBindings = async () => {
  const ids = Object.keys(ViewletModuleId)
  const modules = await Promise.all(ids.map(maybeLoad))
  const keyBindingsPromises = await Promise.all([...modules.map(getViewletKeyBindings), getExtensionKeyBindings()])
  return keyBindingsPromises.flat(1)
}
