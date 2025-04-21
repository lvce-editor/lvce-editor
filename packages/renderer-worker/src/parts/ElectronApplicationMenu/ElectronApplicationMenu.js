import * as Command from '../Command/Command.js'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as MenuEntriesEdit from '../MenuEntriesEdit/MenuEntriesEdit.js'
import * as MenuEntriesFile from '../MenuEntriesFile/MenuEntriesFile.js'
import * as MenuEntriesGo from '../MenuEntriesGo/MenuEntriesGo.js'
import * as MenuEntriesHelp from '../MenuEntriesHelp/MenuEntriesHelp.js'
import * as MenuEntriesRun from '../MenuEntriesRun/MenuEntriesRun.js'
import * as MenuEntriesOpenRecent from '../MenuEntriesOpenRecent/MenuEntriesOpenRecent.js'
import * as MenuEntriesSelection from '../MenuEntriesSelection/MenuEntriesSelection.js'
import * as MenuEntriesTerminal from '../MenuEntriesTerminal/MenuEntriesTerminal.js'
import * as MenuEntriesTitleBar from '../MenuEntriesTitleBar/MenuEntriesTitleBar.js'
import * as MenuEntriesView from '../MenuEntriesView/MenuEntriesView.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ToElectronMenu from '../ToElectronMenu/ToElectronMenu.js'

const menuEntries = [
  MenuEntriesFile,
  MenuEntriesEdit,
  MenuEntriesSelection,
  MenuEntriesView,
  MenuEntriesGo,
  MenuEntriesRun,
  MenuEntriesTerminal,
  MenuEntriesHelp,
  MenuEntriesTitleBar,
  MenuEntriesOpenRecent,
]

export const state = {
  commandMap: Object.create(null),
}

const setItems = async (items) => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronApplicationMenu.setItems', windowId, items)
}

const getEntryMap = async (modules) => {
  const map = Object.create(null)
  for (const module of modules) {
    const id = module.id
    const entries = await module.getMenuEntries()
    map[id] = entries
  }
  return map
}

export const hydrate = async () => {
  const map = await getEntryMap(menuEntries)
  const { electronMenu, commandMap } = ToElectronMenu.toElectronMenu(map, MenuEntryId.TitleBar)
  state.commandMap = commandMap
  await setItems(electronMenu)
  // TODO get all menu items
  // TODO send menu items to electron
  // TODO add listener for when menu items change
}

export const handleClick = async (label) => {
  const commandPair = state.commandMap[label]
  if (!commandPair) {
    throw new Error(`no command found for ${label}`)
  }
  const { command, args = [] } = commandPair
  await Command.execute(command, ...args)
}
