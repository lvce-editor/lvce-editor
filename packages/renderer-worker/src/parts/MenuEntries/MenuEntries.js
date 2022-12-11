import * as MenuEntriesModule from '../MenuEntriesModule/MenuEntriesModule.js'
import { VError } from '../VError/VError.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getMenuEntries = async (id, ...args) => {
  try {
    const module = await MenuEntriesModule.load(id)
    // @ts-ignore
    const inject = module.inject || []
    const viewletStates = inject.map(ViewletStates.getState)
    return module.getMenuEntries(...viewletStates, ...args)
  } catch (error) {
    throw new VError(error, `Failed to load menu entries for id ${id}`)
  }
}
