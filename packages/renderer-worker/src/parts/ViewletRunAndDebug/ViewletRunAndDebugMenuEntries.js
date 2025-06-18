import * as DebugWorker from '../DebugWorker/DebugWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const modules = await DebugWorker.invoke('RunAndDebug.getMenuEntries')
    return modules
  } catch {
    return []
  }
}
