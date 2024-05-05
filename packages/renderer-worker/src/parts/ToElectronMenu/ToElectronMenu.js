import * as ToElectronMenuItem from '../ToElectronMenuItem/ToElectronMenuItem.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as Assert from '../Assert/Assert.ts'

const toElectronMenuInternal = (commandMap, map, id, electronMenu) => {
  Assert.object(commandMap)
  Assert.object(map)
  Assert.number(id)
  Assert.array(electronMenu)
  const entries = map[id]
  Assert.array(entries)
  for (const entry of entries) {
    if (entry.command) {
      commandMap[entry.label] = {
        command: entry.command,
        args: entry.args,
      }
    }
    const electronEntry = ToElectronMenuItem.toElectronMenuItem(entry)
    if (entry.flags === MenuItemFlags.SubMenu) {
      toElectronMenuInternal(commandMap, map, entry.id, electronEntry.submenu)
    }
    electronMenu.push(electronEntry)
  }
  return { electronMenu, commandMap }
}

export const toElectronMenu = (map, rootId) => {
  const electronMenu = []
  const commandMap = Object.create(null)
  toElectronMenuInternal(commandMap, map, rootId, electronMenu)
  return { electronMenu, commandMap }
}
