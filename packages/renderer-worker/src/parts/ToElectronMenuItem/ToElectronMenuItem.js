import * as ElectronMenuItemRole from '../ElectronMenuItemRole/ElectronMenuItemRole.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const toElectronMenuItem = (entry) => {
  switch (entry.flags) {
    case MenuItemFlags.Separator:
      return {
        role: '',
      }
    default:
      if (entry.label === 'Help') {
        return {
          role: ElectronMenuItemRole.Help,
        }
      }
      if (entry.label === 'File') {
        return {
          role: ElectronMenuItemRole.FileMenu,
        }
      }
      if (entry.label === 'Edit') {
        return {
          role: ElectronMenuItemRole.EditMenu,
        }
      }
      if (entry.label === 'Exit') {
        return {
          role: ElectronMenuItemRole.Quit,
        }
      }
      if (entry.label === 'Undo') {
        return {
          role: ElectronMenuItemRole.Undo,
        }
      }
      if (entry.label === 'Redo') {
        return {
          role: ElectronMenuItemRole.Redo,
        }
      }
      if (entry.label === 'Cut') {
        return {
          role: ElectronMenuItemRole.Cut,
        }
      }
      if (entry.label === 'Copy') {
        return {
          role: ElectronMenuItemRole.Copy,
        }
      }
      if (entry.label === 'Paste') {
        return {
          role: ElectronMenuItemRole.Paste,
        }
      }
      if (entry.label === 'Select All') {
        return {
          role: ElectronMenuItemRole.SelectAll,
        }
      }
      if (entry.label === 'Toggle Developer Tools') {
        return {
          role: ElectronMenuItemRole.ToggleDevTools,
        }
      }
      if (entry.label === 'About') {
        return {
          role: ElectronMenuItemRole.About,
        }
      }
      return {
        label: entry.label,
      }
  }
}
