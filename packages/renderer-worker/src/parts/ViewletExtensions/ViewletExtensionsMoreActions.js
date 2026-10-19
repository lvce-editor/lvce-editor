import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const id = MenuEntryId.ExtensionsMoreActions

export const getMenuEntries = () => [
  {
    id: 'show-running-extensions',
    label: 'Show Running Extensions',
    flags: MenuItemFlags.None,
    command: 'Main.openUri',
    args: ['running-extensions://'],
  },
]

export const eventListener = {
  name: 'handleExtensionsMoreActions',
  params: ['showMoreActions'],
}

export const showMoreActions = async (state) => {
  // The child starts immediately below the sidebar title bar.
  await ContextMenu.show2Below(state.uid, id, state.x + state.width - 28, state.y)
  return state
}
