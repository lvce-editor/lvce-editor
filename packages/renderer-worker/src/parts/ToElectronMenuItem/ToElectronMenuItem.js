import * as ElectronMenuItemRole from '../ElectronMenuItemRole/ElectronMenuItemRole.js'
import * as ElectronMenuItemType from '../ElectronMenuItemType/ElectronMenuItemType.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Help: 'Help',
  File: 'File',
  Edit: 'Edit',
  Exit: 'Exit',
  Undo: 'Undo',
  Redo: 'Redo',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
  SelectAll: 'Select All',
  ToggleDeveloperTools: 'Toggle Developer Tools',
  About: 'About',
}

export const toElectronMenuItem = (entry) => {
  switch (entry.flags) {
    case MenuItemFlags.Separator:
      return {
        type: ElectronMenuItemType.Separator,
      }
    case MenuItemFlags.SubMenu:
      return {
        type: ElectronMenuItemType.SubMenu,
      }
    default:
      if (entry.name === UiStrings.Help) {
        return {
          role: ElectronMenuItemRole.Help,
        }
      }
      if (entry.name === UiStrings.File) {
        return {
          role: ElectronMenuItemRole.FileMenu,
        }
      }
      if (entry.name === UiStrings.Edit) {
        return {
          role: ElectronMenuItemRole.EditMenu,
        }
      }
      if (entry.label === UiStrings.Exit) {
        return {
          role: ElectronMenuItemRole.Quit,
        }
      }
      if (entry.label === UiStrings.Undo) {
        return {
          role: ElectronMenuItemRole.Undo,
        }
      }
      if (entry.label === UiStrings.Redo) {
        return {
          role: ElectronMenuItemRole.Redo,
        }
      }
      if (entry.label === UiStrings.Cut) {
        return {
          role: ElectronMenuItemRole.Cut,
        }
      }
      if (entry.label === UiStrings.Copy) {
        return {
          role: ElectronMenuItemRole.Copy,
        }
      }
      if (entry.label === UiStrings.Paste) {
        return {
          role: ElectronMenuItemRole.Paste,
        }
      }
      if (entry.label === UiStrings.SelectAll) {
        return {
          role: ElectronMenuItemRole.SelectAll,
        }
      }
      if (entry.label === UiStrings.ToggleDeveloperTools) {
        return {
          role: ElectronMenuItemRole.ToggleDevTools,
        }
      }
      if (entry.label === UiStrings.About) {
        return {
          role: ElectronMenuItemRole.About,
        }
      }
      return {
        label: entry.label,
      }
  }
}
