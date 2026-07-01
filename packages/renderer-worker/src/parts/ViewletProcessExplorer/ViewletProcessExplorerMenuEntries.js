import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ProcessExplorerWorker from '../ProcessExplorerWorker/ProcessExplorerWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await ProcessExplorerWorker.invoke(
      'ProcessExplorer.getMenuEntryIds',
    )
    return ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          return ProcessExplorerWorker.invoke(
            'ProcessExplorer.getMenuEntries',
            ...args,
          )
        },
      }
    })
  } catch {
    return [
      {
        id: MenuEntryId.ProcessExplorer,
        async getMenuEntries(...args) {
          return ProcessExplorerWorker.invoke(
            'ProcessExplorer.getMenuEntries',
            ...args,
          )
        },
      },
    ]
  }
}
