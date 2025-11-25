import * as SourceControlWorker from '../SourceControlWorker/SourceControlWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await SourceControlWorker.invoke('SourceControl.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          // TODO pass menu id also
          const entries = await SourceControlWorker.invoke('SourceControl.getMenuEntries2', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
