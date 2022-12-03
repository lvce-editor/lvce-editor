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

const getEntries = () => {
  return Promise.all([
    MenuEntries.getMenuEntries(MenuEntryId.TitleBar),
    MenuEntries.getMenuEntries(MenuEntryId.File),
    MenuEntries.getMenuEntries(MenuEntryId.Edit),
    MenuEntries.getMenuEntries(MenuEntryId.Selection),
    MenuEntries.getMenuEntries(MenuEntryId.View),
    MenuEntries.getMenuEntries(MenuEntryId.Go),
    MenuEntries.getMenuEntries(MenuEntryId.Run),
    MenuEntries.getMenuEntries(MenuEntryId.Terminal),
    MenuEntries.getMenuEntries(MenuEntryId.Help),
  ])
}

export const hydrate = async () => {
  const [entriesTitleBar, ...subMenus] = await getEntries()
  const { electronMenu, commandMap } = ToElectronMenu.toElectronMenu(
    entriesTitleBar,
    subMenus
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
  const { command, args } = commandPair
  await Command.execute(command, ...args)
}
