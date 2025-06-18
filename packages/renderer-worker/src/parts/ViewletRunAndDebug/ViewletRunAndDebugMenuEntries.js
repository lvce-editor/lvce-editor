import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const menus = []

export const getMenus = async () => {
  try {
    const modules = await TitleBarWorker.invoke('RunAndDebug.getMenuEntries')
    return modules
  } catch {
    return []
  }
}
