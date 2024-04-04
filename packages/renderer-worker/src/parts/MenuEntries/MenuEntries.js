import * as MenuEntriesModule from '../MenuEntriesModule/MenuEntriesModule.js'
import * as MenuEntriesRegistryState from '../MenuEntriesRegistryState/MenuEntriesRegistryState.js'
import { VError } from '../VError/VError.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const getModule = (id) => {
  // const module = MenuEntriesRegistryState.get(id)
  // if (module) {
  //   return module
  // }
  return MenuEntriesModule.load(id)
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
