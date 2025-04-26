import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.js'
import * as DefaultIcon from '../DefaultIcon/DefaultIcon.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as GetAbsoluteIconPath from '../GetAbsoluteIconPath/GetAbsoluteIconPath.js'
import * as IconThemeState from '../IconThemeState/IconThemeState.js'
import * as Languages from '../Languages/Languages.js'
import * as Logger from '../Logger/Logger.js'

export const getFileNameIcon = (file) => {
  Assert.string(file)
  const iconTheme = IconThemeState.getIconTheme()
  const fileNameLower = file.toLowerCase()
  if (!iconTheme) {
    return ''
  }
  if (iconTheme.fileNames) {
    const fileNameIcon = iconTheme.fileNames[fileNameLower]
    if (fileNameIcon) {
      return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, fileNameIcon)
    }
  }
  if (iconTheme.fileExtensions) {
    let index = -1
    while ((index = fileNameLower.indexOf(Character.Dot, index + 1)) !== -1) {
      const shorterExtension = fileNameLower.slice(index + 1)
      const extensionIcon = iconTheme.fileExtensions[shorterExtension]
      if (extensionIcon) {
        return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, extensionIcon)
      }
    }
  }
  if (iconTheme.languageIds) {
    const languageId = Languages.getLanguageId(fileNameLower)
    const languageIcon = iconTheme.languageIds[languageId]
    if (languageId === 'jsx' && fileNameLower.endsWith('.js')) {
      const alternativeFileIcon = iconTheme.languageIds.javascript
      if (alternativeFileIcon) {
        return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, alternativeFileIcon)
      }
    }
    if (languageIcon) {
      return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, languageIcon)
    }
  }
  return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.File)
}

export const getFileIcon = (file) => {
  return getFileNameIcon(file.name)
}

export const getFileIcons = (fileNames) => {
  const icons = []
  for (const fileName of fileNames) {
    icons.push(getFileIcon(fileName))
  }
  return icons
}

export const getFolderNameIcon = (folderName) => {
  const iconTheme = IconThemeState.getIconTheme()
  // @ts-ignore
  if (!iconTheme || !iconTheme.folderNames || !iconTheme.iconDefinitions) {
    return ''
  }
  const folderNameLower = folderName.toLowerCase()
  // @ts-ignore
  const folderIcon = iconTheme.folderNames[folderNameLower]
  if (folderIcon) {
    return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, folderIcon)
  }
  return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.Folder)
}

export const getFolderIcon = (folder) => {
  return getFolderNameIcon(folder.name)
}

const getFolderIconExpanded = (folder) => {
  const iconTheme = IconThemeState.getIconTheme()
  if (!iconTheme) {
    return ''
  }
  // @ts-ignore
  if (!iconTheme.folderNamesExpanded) {
    return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.FolderOpen)
  }
  // @ts-ignore
  const folderName = iconTheme.folderNamesExpanded[folder.name.toLowerCase()]
  if (folderName) {
    return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, folderName)
  }
  return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.FolderOpen)
}

export const getIcon = (dirent) => {
  switch (dirent.type) {
    case DirentType.File:
    case DirentType.SymLinkFile:
      return getFileIcon(dirent)
    case DirentType.Directory:
    case DirentType.SymLinkFolder:
      return getFolderIcon(dirent)
    case DirentType.DirectoryExpanded:
      return getFolderIconExpanded(dirent)
    case DirentType.Symlink:
    case DirentType.CharacterDevice:
    case DirentType.BlockDevice:
    case DirentType.Socket:
      return GetAbsoluteIconPath.getAbsoluteIconPath(IconThemeState.getIconTheme(), DefaultIcon.File)
    default:
      Logger.warn(`unsupported type ${dirent.type}`)
      return DefaultIcon.None
  }
}

export const getIcons = (iconRequests) => {
  const Folder = 2
  return iconRequests.map((request) => {
    if (request.type === Folder) {
      return getFolderIcon({ name: request.name })
    }
    return getFileIcon({ name: request.name })
  })
}
