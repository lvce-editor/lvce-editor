import * as ProblemsWorker from '../ProblemsWorker/ProblemsWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await ProblemsWorker.invoke('Problems.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          const entries = await ProblemsWorker.invoke('Problems.getMenuEntries2', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
