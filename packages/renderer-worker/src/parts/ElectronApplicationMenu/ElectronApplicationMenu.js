import * as Command from '../Command/Command.js'
import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ToElectronMenu from '../ToElectronMenu/ToElectronMenu.js'

export const state = {
  commandMap: Object.create(null),
}

const setItems = (items) => {
  return ElectronProcess.invoke('AppWindowTitleBar.setItems', items)
}

const getEntries = (ids) => {
  return Promise.all(ids.map(MenuEntries.getMenuEntries))
}

const getEntryMap = (ids, entries) => {
  const map = Object.create(null)
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const value = entries[i]
    map[id] = value
  }
  return map
}

export const hydrate = async () => {
  const ids = [
    MenuEntryId.TitleBar,
    MenuEntryId.File,
    MenuEntryId.Edit,
    MenuEntryId.Selection,
    MenuEntryId.View,
    MenuEntryId.Go,
    MenuEntryId.Run,
    MenuEntryId.Terminal,
    MenuEntryId.Help,
    MenuEntryId.OpenRecent,
  ]
  const entries = await getEntries(ids)
  const map = getEntryMap(ids, entries)
  const { electronMenu, commandMap } = ToElectronMenu.toElectronMenu(
    map,
    MenuEntryId.TitleBar
  )
  state.commandMap = commandMap
  // console.log({ electronMenu })
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
