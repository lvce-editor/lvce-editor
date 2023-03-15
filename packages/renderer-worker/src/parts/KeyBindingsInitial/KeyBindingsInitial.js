import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

// TODO extension key bindings

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
  const keyBindings = modules.flatMap(getViewletKeyBindings)
  return keyBindings
}
