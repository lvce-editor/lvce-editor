import * as EditorWorker from '../EditorWorker/EditorWorker.ts'

export const getQuickPickMenuEntries = async () => {
  // @ts-ignore
  const entries = await EditorWorker.invoke('Editor.getQuickPickMenuEntries')
  return entries
}

export const menus = []

export const getMenus = async () => {
  try {
    // @ts-ignore
    const ids = await EditorWorker.invoke('Editor.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          // TODO pass menu id also
          // @ts-ignore
          const entries = await EditorWorker.invoke('Editor.getMenuEntries2', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
