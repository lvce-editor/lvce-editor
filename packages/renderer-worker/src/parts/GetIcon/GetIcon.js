import * as Assert from '../Assert/Assert.js'
import * as Character from '../Character/Character.js'
import * as DefaultIcon from '../DefaultIcon/DefaultIcon.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as IconThemeState from '../IconThemeState/IconThemeState.js'
import * as Languages from '../Languages/Languages.js'
import * as Logger from '../Logger/Logger.js'

const getResult = (iconTheme, icon) => {
  const result = iconTheme.iconDefinitions[icon]
  const extensionPath = IconThemeState.state.extensionPath
  if (result) {
    if (extensionPath.includes('\\')) {
      const extensionUri = extensionPath.replaceAll('\\', '/')
      return `/remote/${extensionUri}/${result}`
    }
    return `/remote${extensionPath}/${result}`
  }
  return ''
}

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
      return getResult(iconTheme, fileNameIcon)
    }
  }
  if (iconTheme.fileExtensions) {
    let index = -1
    while ((index = fileNameLower.indexOf(Character.Dot, index + 1)) !== -1) {
      const shorterExtension = fileNameLower.slice(index + 1)
      const extensionIcon = iconTheme.fileExtensions[shorterExtension]
      if (extensionIcon) {
        return getResult(iconTheme, extensionIcon)
      }
    }
  }
  if (iconTheme.languageIds) {
    const languageId = Languages.getLanguageId(fileNameLower)
    const languageIcon = iconTheme.languageIds[languageId]
    if (languageId === 'jsx' && fileNameLower.endsWith('.js')) {
      const alternativeFileIcon = iconTheme.languageIds['javascript']
      if (alternativeFileIcon) {
        return getResult(iconTheme, alternativeFileIcon)
      }
    }
    if (languageIcon) {
      return getResult(iconTheme, languageIcon)
    }
  }
  return getResult(iconTheme, DefaultIcon.File)
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
    return getResult(iconTheme, folderIcon)
  }
  return getResult(iconTheme, DefaultIcon.Folder)
}

const getFolderIconExpanded = (folder) => {
  const iconTheme = IconThemeState.state.iconTheme
  if (!iconTheme) {
    return ''
  }
  // @ts-ignore
  if (!iconTheme.folderNamesExpanded) {
    return getResult(iconTheme, DefaultIcon.FolderOpen)
  }
  // @ts-ignore
  const folderName = iconTheme.folderNamesExpanded[folder.name.toLowerCase()]
  if (folderName) {
    return getResult(iconTheme, folderName)
  }
  return getResult(iconTheme, DefaultIcon.FolderOpen)
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
      return DefaultIcon.File
    default:
      Logger.warn(`unsupported type ${dirent.type}`)
      return DefaultIcon.None
  }
}
