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
  switch (entry.label) {
    case UiStrings.Help:
      return {
        role: ElectronMenuItemRole.Help,
      }
    case UiStrings.File:
      return {
        role: ElectronMenuItemRole.FileMenu,
      }
    case UiStrings.Edit:
      return {
        role: ElectronMenuItemRole.EditMenu,
      }
    case UiStrings.Exit:
      return {
        role: ElectronMenuItemRole.Quit,
      }
    case UiStrings.Undo:
      return {
        role: ElectronMenuItemRole.Undo,
      }
    case UiStrings.Redo:
      return {
        role: ElectronMenuItemRole.Redo,
      }
    case UiStrings.Cut:
      return {
        role: ElectronMenuItemRole.Cut,
      }
    case UiStrings.Copy:
      return {
        role: ElectronMenuItemRole.Copy,
      }
    case UiStrings.Paste:
      return {
        role: ElectronMenuItemRole.Paste,
      }
    case UiStrings.SelectAll:
      return {
        role: ElectronMenuItemRole.SelectAll,
      }
    case UiStrings.ToggleDeveloperTools:
      return {
        role: ElectronMenuItemRole.ToggleDevTools,
      }
    case UiStrings.About:
      return {
        role: ElectronMenuItemRole.About,
      }
    default:
      break
  }
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
      return {
        label: entry.label,
      }
  }
}
