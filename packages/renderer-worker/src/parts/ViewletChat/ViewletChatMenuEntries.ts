import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await ChatViewWorker.invoke('Chat.getMenuEntryIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          const entries = await ChatViewWorker.invoke('Chat.getMenuEntries', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
