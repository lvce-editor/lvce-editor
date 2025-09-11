import * as IconThemeWorker from '../IconThemeWorker/IconThemeWorker.js'

export const getFileIcon = (file) => {
  return IconThemeWorker.invoke('IconTheme.getFileIcon', file)
}

export const getFileIcons = (fileNames) => {
  return IconThemeWorker.invoke('IconTheme.getFileIcons', fileNames)
}

export const getFolderIcon = (folder) => {
  return IconThemeWorker.invoke('IconTheme.getFolderIcon', folder)
}

export const getIcon = (dirent) => {
  return IconThemeWorker.invoke('IconTheme.getIcon', dirent)
}

export const getIcons = (iconRequests) => {
  return IconThemeWorker.invoke('IconTheme.getIcons', iconRequests)
}
