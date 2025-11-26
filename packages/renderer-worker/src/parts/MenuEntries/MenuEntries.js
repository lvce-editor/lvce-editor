import * as MenuEntriesRegistryState from '../MenuEntriesRegistryState/MenuEntriesRegistryState.js'
import { VError } from '../VError/VError.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const getModule = (id) => {
  const module = MenuEntriesRegistryState.get(id)
  if (module) {
    return module
  }
  throw new Error(`menu entries for ${id} not found`)
}

export const getMenuEntries = async (id, ...args) => {
  try {
    const module = await getModule(id)
    // @ts-ignore
    const inject = module.inject || []
    const viewletStates = inject.map(ViewletStates.getState)
    return module.getMenuEntries(...viewletStates, ...args)
  } catch (error) {
    throw new VError(error, `Failed to load menu entries for id ${id}`)
  }
}

export const getMenuEntries2 = async (uid, menuId, ...args) => {
  try {
    const module = await getModule(menuId)
    // @ts-ignore
    return module.getMenuEntries(uid, ...args)
  } catch (error) {
    throw new VError(error, `Failed to load menu entries for id ${menuId}`)
  }
}
