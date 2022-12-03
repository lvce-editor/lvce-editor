import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ToElectronMenuItem from '../ToElectronMenuItem/ToElectronMenuItem.js'

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

const toElectronMenu = (entries, subMenus) => {
  const electronEntries = []
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const subMenu = subMenus[i]
    const electronEntry = {
      label: entry.name,
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
      }
    }
    electronEntries.push(electronEntry)
  }
  return electronEntries
}

export const hydrate = async () => {
  const [entriesTitleBar, ...subMenus] = await getEntries()

  const electronMenu = toElectronMenu(entriesTitleBar, subMenus)
  console.log({ electronMenu })
  await setItems(electronMenu)
  // TODO get all menu items
  // TODO send menu items to electron
  // TODO add listener for when menu items change
}

export const handleClick = (label) => {
  console.log({ label })
}
