import * as DebugWorker from '../DebugWorker/DebugWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const modules = await DebugWorker.invoke('RunAndDebug.getMenuEntries')
    const adjusted = modules.map((module) => {
      return {
        ...module,
        async getMenuEntries() {
          return module.entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
