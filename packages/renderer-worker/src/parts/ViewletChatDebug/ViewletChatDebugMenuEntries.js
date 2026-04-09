import * as ChatDebugViewWorker from '../ChatDebugViewWorker/ChatDebugViewWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await ChatDebugViewWorker.invoke('ChatDebug.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          // TODO pass menu id also
          const entries = await ChatDebugViewWorker.invoke('ChatDebug.getMenuEntries', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
