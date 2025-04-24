import * as IconTheme from './IconTheme.js'

export const name = 'IconTheme'

export const Commands = {
  // TODO command necessary?
  // TODO hydrate should be an alias for reload/load
  hydrate: IconTheme.hydrate,
  setIconTheme: IconTheme.setIconTheme,
  getFileIcon: IconTheme.getFileIcon,
  getFileIcons: IconTheme.getFileIcons,
  getFolderIcon: IconTheme.getFolderIcon,
  getIcon: IconTheme.getIcon,
  getIcons: IconTheme.getIcons,
}
