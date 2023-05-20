import * as Character from '../Character/Character.js'
import * as DefaultIcon from '../DefaultIcon/DefaultIcon.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as GetIconThemeJson from '../GetIconThemeJson/GetIconThemeJson.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Languages from '../Languages/Languages.js'
import * as Logger from '../Logger/Logger.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

export const state = {
  seenFiles: [],
  seenFolders: [],
  hasWarned: [],
  /**
   * @type{any}
   */
  iconTheme: undefined,
}

export const getFileNameIcon = (file) => {
  const { iconTheme } = state
  const fileNameLower = file.toLowerCase()
  if (!iconTheme) {
    return ''
  }
  if (iconTheme.fileNames) {
    const fileNameIcon = iconTheme.fileNames[fileNameLower]
    if (fileNameIcon) {
      return fileNameIcon
    }
  }
  if (iconTheme.fileExtensions) {
    let index = -1
    while ((index = fileNameLower.indexOf(Character.Dot, index + 1)) !== -1) {
      const shorterExtension = fileNameLower.slice(index + 1)
      const extensionIcon = iconTheme.fileExtensions[shorterExtension]
      if (extensionIcon) {
        return extensionIcon
      }
    }
  }
  if (iconTheme.languageIds) {
    const languageId = Languages.getLanguageId(fileNameLower)
    const languageIcon = iconTheme.languageIds[languageId]
    if (languageId === 'jsx' && fileNameLower.endsWith('.js')) {
      const alternativeFileIcon = iconTheme.languageIds['javascript']
      if (alternativeFileIcon) {
        return alternativeFileIcon
      }
    }
    if (languageIcon) {
      return languageIcon
    }
  }
  return DefaultIcon.File
}

export const getFileIcon = (file) => {
  return getFileNameIcon(file.name)
}

export const getFolderIcon = (folder) => {
  const iconTheme = state.iconTheme
  // @ts-ignore
  if (!iconTheme || !iconTheme.folderNames) {
    return ''
  }
  const folderNameLower = folder.name.toLowerCase()
  // @ts-ignore
  const folderIcon = iconTheme.folderNames[folderNameLower]
  if (folderIcon) {
    return folderIcon
  }
  return DefaultIcon.Folder
}

const getFolderIconExpanded = (folder) => {
  const iconTheme = state.iconTheme
  if (!iconTheme) {
    return ''
  }
  // @ts-ignore
  if (!iconTheme.folderNamesExpanded) {
    return DefaultIcon.FolderOpen
  }
  // @ts-ignore
  const folderName = iconTheme.folderNamesExpanded[folder.name.toLowerCase()]
  if (folderName) {
    return folderName
  }
  return DefaultIcon.FolderOpen
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

const getBackgroundUrl = (extensionPath, value) => {
  if (Platform.platform === PlatformType.Web) {
    return `${extensionPath}${value}`
  }
  if (extensionPath.startsWith('http://')) {
    return `${extensionPath}${value}`
  }
  // TODO what if the file in on linux and includes a backslash?
  if (extensionPath.includes('\\')) {
    const extensionUri = extensionPath.replaceAll('\\', '/')
    return `/remote/${extensionUri}/${value}`
  }
  return `/remote${extensionPath}/${value}`
}

const getIconThemeCss2 = (iconTheme) => {
  const rules = []
  const iconDefinitions = iconTheme.json.iconDefinitions
  const extensionPath = iconTheme.extensionPath
  for (const [key, value] of Object.entries(iconDefinitions)) {
    const backgroundUrl = getBackgroundUrl(extensionPath, value)
    rules.push(`.FileIcon${key} { background-image: url(${backgroundUrl}) }`)
  }
  const rulesCss = JoinLines.joinLines(rules)
  return rulesCss
}

export const setIconTheme = async (iconThemeId) => {
  try {
    const iconTheme = await GetIconThemeJson.getIconThemeJson(iconThemeId)
    state.iconTheme = iconTheme.json
    state.extensionPath = iconTheme.extensionPath
    const iconThemeCss = getIconThemeCss2(iconTheme)

    const instances = ViewletStates.getAllInstances()
    // TODO have one recalculate style and one paint
    for (const [key, value] of Object.entries(instances)) {
      const { factory, state } = value
      if (factory.handleIconThemeChange) {
        const newState = factory.handleIconThemeChange(state)
        await Viewlet.setState(factory.name, newState)
      }
    }
    await RendererProcess.invoke(/* Css.setInlineStyle */ 'Css.setInlineStyle', /* id */ 'ContributedIconTheme', /* css */ iconThemeCss)
  } catch (error) {
    if (Workspace.isTest()) {
      // ignore
    } else {
      console.error(new VError(error, `Failed to load icon theme`))
    }
  }
}

export const hydrate = async () => {
  // TODO icon theme css can be really large (3000+ lines)
  // and slow down recalculate style by 5x (e.g. rendering text in editor: 1.42ms normal, 7.42ms with icon theme)
  // icon theme should not slow down editor.
  // maybe set applied css only to actual used icons
  // for example, when a js file is in explorer, only generate the css for the js icon
  // that way there would be much less rules, but when a new file type appears (which should not happen often)
  // the css must be recalculated again
  // const iconThemeCss = await getIconThemeCss()
  // await RendererProcess.invoke(
  //   /* Css.setInlineStyle */ 4551,
  //   /* id */ 'ContributedIconTheme',
  //   /* css */ iconThemeCss
  // )

  const iconThemeId = Preferences.get('icon-theme') || 'vscode-icons'
  await setIconTheme(iconThemeId)
}
