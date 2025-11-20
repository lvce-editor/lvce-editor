import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await KeyBindingsViewWorker.invoke('KeyBindings.getMenuEntryIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          // TODO pass menu id also
          const entries = await KeyBindingsViewWorker.invoke('KeyBindings.getMenuEntries', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
