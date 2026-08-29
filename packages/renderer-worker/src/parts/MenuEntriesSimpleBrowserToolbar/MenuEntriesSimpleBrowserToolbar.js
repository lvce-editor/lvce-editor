import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

const entry = (id, label, command) => ({
  id,
  label,
  flags: MenuItemFlags.None,
  command,
})

export const id = MenuEntryId.SimpleBrowserToolbar

export const getMenuEntries = () => {
  return [
    entry('new-tab', 'New Tab', 'SimpleBrowser.createNewTab'),
    entry('reload', 'Reload', 'SimpleBrowser.reload'),
    entry('open-external', 'Open in Default Browser', 'SimpleBrowser.openExternal'),
    MenuEntrySeparator.menuEntrySeparator,
    entry('history', 'History', 'SimpleBrowser.openHistory'),
    entry('downloads', 'Downloads', 'SimpleBrowser.openDownloads'),
    MenuEntrySeparator.menuEntrySeparator,
    entry('zoom-in', 'Zoom In', 'SimpleBrowser.zoomIn'),
    entry('zoom-out', 'Zoom Out', 'SimpleBrowser.zoomOut'),
    entry('reset-zoom', 'Reset Zoom', 'SimpleBrowser.resetZoom'),
    MenuEntrySeparator.menuEntrySeparator,
    entry('toggle-developer-tools', 'Toggle Developer Tools', 'SimpleBrowser.toggleDevTools'),
    MenuEntrySeparator.menuEntrySeparator,
    entry('close-tab', 'Close Tab', 'SimpleBrowser.closeCurrentTab'),
  ]
}
