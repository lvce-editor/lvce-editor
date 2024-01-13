import * as MenuEntriesState from '../MenuEntriesState/MenuEntriesState.js'

export const loadModule = (id, module) => {
  if (module.getQuickPickMenuEntries) {
    MenuEntriesState.add(module.getQuickPickMenuEntries())
  }
}
