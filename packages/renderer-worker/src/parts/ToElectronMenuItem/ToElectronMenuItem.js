import * as ElectronMenuItemType from '../ElectronMenuItemType/ElectronMenuItemType.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const toElectronMenuItem = (entry) => {
  switch (entry.flags) {
    case MenuItemFlags.Separator:
      return {
        role: '',
      }
    default:
      if (entry.name === 'Help') {
        return {
          role: ElectronMenuItemType.Help,
        }
      }
      if (entry.name === 'File') {
        return {
          role: ElectronMenuItemType.FileMenu,
        }
      }
      if (entry.name === 'Edit') {
        return {
          role: ElectronMenuItemType.EditMenu,
        }
      }
      if (entry.label === 'Exit') {
        return {
          role: ElectronMenuItemType.Quit,
        }
      }
      if (entry.label === 'Undo') {
        return {
          role: ElectronMenuItemType.Undo,
        }
      }
      if (entry.label === 'Redo') {
        return {
          role: ElectronMenuItemType.Redo,
        }
      }
      if (entry.label === 'Cut') {
        return {
          role: ElectronMenuItemType.Cut,
        }
      }
      if (entry.label === 'Copy') {
        return {
          role: ElectronMenuItemType.Copy,
        }
      }
      if (entry.label === 'Paste') {
        return {
          role: ElectronMenuItemType.Paste,
        }
      }
      if (entry.label === 'Select All') {
        return {
          role: ElectronMenuItemType.SelectAll,
        }
      }
      if (entry.label === 'Toggle Developer Tools') {
        return {
          role: ElectronMenuItemType.ToggleDevTools,
        }
      }
      if (entry.label === 'About') {
        return {
          role: ElectronMenuItemType.About,
        }
      }
      return {
        label: entry.label,
      }
  }
}
