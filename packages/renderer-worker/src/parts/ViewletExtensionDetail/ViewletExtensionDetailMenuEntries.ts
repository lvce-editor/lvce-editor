import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const modules = await ExtensionDetailViewWorker.invoke('ExtensionDetail.getMenus')
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
