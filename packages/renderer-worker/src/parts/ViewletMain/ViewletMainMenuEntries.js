import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'

export const getQuickPickMenuEntries = () => {
  return [
    {
      id: 'Main.splitRight',
      label: 'Main: Split Right',
    },
    {
      id: 'Main.splitLeft',
      label: 'Main: Split Left',
    },
    {
      id: 'Main.splitDown',
      label: 'Main: Split Down',
    },
    {
      id: 'Main.splitUp',
      label: 'Main: Split Up',
    },
    {
      id: 'Main.reopenEditorWith',
      label: 'Main: Reopen Editor With',
    },
  ]
}

export const menus = []

export const getMenus = async () => {
  try {
    const ids = await MainAreaWorker.invoke('MainArea.getMenuIds')
    const adjusted = ids.map((id) => {
      return {
        id,
        async getMenuEntries(...args) {
          const entries = await MainAreaWorker.invoke('MainArea.getMenuEntries', ...args)
          return entries
        },
      }
    })
    return adjusted
  } catch {
    return []
  }
}
