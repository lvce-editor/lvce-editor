import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

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
    MenuEntries.getMenuEntries(MenuEntryId.Terminal),
    MenuEntries.getMenuEntries(MenuEntryId.Help),
  ])
}

const toElectronMenu = (entries) => {
  const electronEntries = []
  for (const entry of entries) {
    electronEntries.push({
      label: entry.name,
    })
  }
  return electronEntries
}

export const hydrate = async () => {
  const [
    entriesTitleBar,
    entriesFile,
    entriesEdit,
    entriesSelection,
    entriesView,
    entriesGo,
    entriesTerminal,
    entriesHelp,
  ] = await getEntries()

  console.log({ entriesTitleBar, entriesFile, entriesEdit, entriesSelection })
  const electronMenu = toElectronMenu(entriesTitleBar)
  await setItems(electronMenu)
  // TODO get all menu items
  // TODO send menu items to electron
  // TODO add listener for when menu items change
}
