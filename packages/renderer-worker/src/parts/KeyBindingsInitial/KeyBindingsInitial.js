import * as ExtensionKeyBindings from '../ExtensionKeyBindings/ExtensionKeyBindings.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const getViewletKeyBindings = (module) => {
  if (module.getKeyBindings) {
    return module.getKeyBindings()
  }
  return []
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
  const keyBindingsPromises = await Promise.all([...modules.map(getViewletKeyBindings), ExtensionKeyBindings.getKeyBindings()])
  return keyBindingsPromises.flat(1)
}
