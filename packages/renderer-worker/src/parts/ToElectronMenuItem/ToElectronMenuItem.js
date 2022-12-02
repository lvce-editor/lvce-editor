import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const toElectronMenuItem = (entry) => {
  switch (entry.flags) {
    case MenuItemFlags.Separator:
      return {
        role: 'separator',
      }
    default:
      if (entry.name === 'Help') {
        return {
          role: 'help',
        }
      }
      if (entry.name === 'File') {
        return {
          role: 'fileMenu',
        }
      }
      if (entry.name === 'Edit') {
        return {
          role: 'editMenu',
        }
      }
      if (entry.label === 'Exit') {
        return {
          role: 'quit',
        }
      }
      if (entry.label === 'Undo') {
        return {
          role: 'undo',
        }
      }
      if (entry.label === 'Redo') {
        return {
          role: 'redo',
        }
      }
      if (entry.label === 'Cut') {
        return {
          role: 'cut',
        }
      }
      if (entry.label === 'Copy') {
        return {
          role: 'copy',
        }
      }
      if (entry.label === 'Paste') {
        return {
          role: 'paste',
        }
      }
      if (entry.label === 'Select All') {
        return {
          role: 'selectAll',
        }
      }
      if (entry.label === 'Toggle Developer Tools') {
        return {
          role: 'toggleDevTools',
        }
      }
      if (entry.label === 'About') {
        return {
          role: 'about',
        }
      }
      return {
        label: entry.label,
      }
  }
}
