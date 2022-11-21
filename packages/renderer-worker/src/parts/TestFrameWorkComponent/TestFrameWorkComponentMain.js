import * as Command from '../Command/Command.js'

export const openUri = async (uri) => {
  await Command.execute('Main.openUri', uri)
}

export const focusPreviousTab = async () => {
  await Command.execute('Main.focusPrevious')
}

export const closeOtherTabs = async () => {
  await Command.execute('Main.closeOthers')
}
