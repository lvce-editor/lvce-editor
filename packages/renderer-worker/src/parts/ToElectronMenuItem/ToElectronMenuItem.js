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
        label: entry.label,
        role: ElectronMenuItemRole.Help,
        submenu: [],
      }
    case UiStrings.File:
      return {
        label: entry.label,
        role: ElectronMenuItemRole.FileMenu,
        submenu: [],
      }
    case UiStrings.Edit:
      return {
        label: entry.label,
        role: ElectronMenuItemRole.EditMenu,
        submenu: [],
      }
    case UiStrings.Exit:
      return {
        label: entry.label,
        role: ElectronMenuItemRole.Quit,
      }
    case UiStrings.Undo:
      return {
        label: entry.label,
        role: ElectronMenuItemRole.Undo,
      }
    case UiStrings.Redo:
      return {
        label: entry.label,
        role: ElectronMenuItemRole.Redo,
      }
    case UiStrings.Cut:
      return {
        label: entry.label,
        role: ElectronMenuItemRole.Cut,
      }
    case UiStrings.Copy:
      return {
        label: entry.label,
        role: ElectronMenuItemRole.Copy,
      }
    case UiStrings.Paste:
      return {
        label: entry.label,
        role: ElectronMenuItemRole.Paste,
      }
    case UiStrings.SelectAll:
      return {
        label: entry.label,
        role: ElectronMenuItemRole.SelectAll,
      }
    case UiStrings.ToggleDeveloperTools:
      return {
        label: entry.label,
        role: ElectronMenuItemRole.ToggleDevTools,
      }
    case UiStrings.About:
      return {
        label: entry.label,
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
        label: entry.label,
        submenu: [],
      }
    default:
      return {
        label: entry.label,
      }
  }
}
