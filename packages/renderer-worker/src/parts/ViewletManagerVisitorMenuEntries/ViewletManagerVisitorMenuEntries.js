import * as MenuEntriesState from '../MenuEntriesState/MenuEntriesState.js'

export const loadModule = async (id, module) => {
  if (module.getQuickPickMenuEntries) {
    const entries = await module.getQuickPickMenuEntries()
    MenuEntriesState.add(entries)
  }
}
