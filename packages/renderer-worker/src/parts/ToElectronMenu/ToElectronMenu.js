import * as ToElectronMenuItem from '../ToElectronMenuItem/ToElectronMenuItem.js'

export const toElectronMenu = (entries, subMenus) => {
  const electronEntries = []
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const subMenu = subMenus[i]
    const electronEntry = {
      label: entry.label,
      /**
       * @type {any[]}
       */
      submenu: [],
    }
    if (subMenu) {
      console.log({ subMenu })
      for (const subMenuEntry of subMenu) {
        const electronSubEntry =
          ToElectronMenuItem.toElectronMenuItem(subMenuEntry)
        electronEntry.submenu.push(electronSubEntry)
        if (subMenuEntry.command) {
          state.commandMap[subMenuEntry.label] = {
            command: subMenuEntry.command,
            args: subMenuEntry.args,
          }
        }
      }
    }
    electronEntries.push(electronEntry)
  }
  return electronEntries
}
