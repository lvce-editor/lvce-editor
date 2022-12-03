import * as ToElectronMenuItem from '../ToElectronMenuItem/ToElectronMenuItem.js'

export const toElectronMenu = (entries, subMenus) => {
  const electronMenu = []
  const commandMap = Object.create(null)
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
          commandMap[subMenuEntry.label] = {
            command: subMenuEntry.command,
            args: subMenuEntry.args,
          }
        }
      }
    }
    electronMenu.push(electronEntry)
  }
  return { electronMenu, commandMap }
}
