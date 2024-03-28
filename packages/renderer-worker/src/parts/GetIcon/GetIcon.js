import * as Assert from '../Assert/Assert.js'
import * as Character from '../Character/Character.js'
import * as DefaultIcon from '../DefaultIcon/DefaultIcon.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as GetAbsoluteIconPath from '../GetAbsoluteIconPath/GetAbsoluteIconPath.js'
import * as IconThemeState from '../IconThemeState/IconThemeState.js'
import * as Languages from '../Languages/Languages.js'
import * as Logger from '../Logger/Logger.js'

export const getFileNameIcon = (file) => {
  Assert.string(file)
  const { iconTheme } = IconThemeState.state
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

export const getFolderIcon = (folder) => {
  const iconTheme = IconThemeState.state.iconTheme
  // @ts-ignore
  if (!iconTheme || !iconTheme.folderNames || !iconTheme.iconDefinitions) {
    return ''
  }
  const folderNameLower = folder.name.toLowerCase()
  // @ts-ignore
  const folderIcon = iconTheme.folderNames[folderNameLower]
  if (folderIcon) {
    return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, folderIcon)
  }
  return GetAbsoluteIconPath.getAbsoluteIconPath(iconTheme, DefaultIcon.Folder)
}

const getFolderIconExpanded = (folder) => {
  const iconTheme = IconThemeState.state.iconTheme
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
      return GetAbsoluteIconPath.getAbsoluteIconPath(IconThemeState.state.iconTheme, DefaultIcon.File)
    default:
      Logger.warn(`unsupported type ${dirent.type}`)
      return DefaultIcon.None
  }
}
