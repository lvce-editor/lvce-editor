import * as GetCommandKeyBinding from '../GetCommandKeyBinding/GetCommandKeyBinding.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'

const addKeyBindings = (menuEntries) => {
  const keyBindings = KeyBindingsState.state.matchingKeyBindings
  const newMenuEntries = []
  for (const menuEntry of menuEntries) {
    const keyBinding = GetCommandKeyBinding.getCommandKeyBinding(keyBindings, menuEntry.command, menuEntry.args)
    const key = keyBinding ? keyBinding.key : 0
    const newMenuEntry = {
      ...menuEntry,
      key,
    }
    newMenuEntries.push(newMenuEntry)
  }
  return newMenuEntries
}

export const getMenuEntriesWithKeyBindings = async (id, ...args) => {
  const menuEntries = await MenuEntries.getMenuEntries(id, ...args)
  const newMenuEntries = addKeyBindings(menuEntries)
  return newMenuEntries
}

export const getMenuEntriesWithKeyBindings2 = async (uid, menuId, ...args) => {
  const menuEntries = await MenuEntries.getMenuEntries2(uid, menuId, ...args)
  const newMenuEntries = addKeyBindings(menuEntries)
  return newMenuEntries
}
