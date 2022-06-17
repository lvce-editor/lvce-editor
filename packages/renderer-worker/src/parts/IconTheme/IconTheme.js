import * as Command from '../Command/Command.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Languages from '../Languages/Languages.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const CACHE_KEY = '/icon-theme.css'

export const state = {
  seenFiles: [],
  seenFolders: [],
  hasWarned: [],
  iconTheme: undefined,
}

const getIconThemeJson = async (iconThemeId) => {
  if (Platform.getPlatform() === 'web') {
    const assetDir = Platform.getAssetDir()
    const url = `${assetDir}/icon-themes/${iconThemeId}.json`
    const json = await Command.execute(/* Ajax.getJson */ 270, /* url */ url)
    return {
      json,
    }
  }
  return SharedProcess.invoke(
    /* ExtensionHost.getIconThemeJson */ 'ExtensionHost.getIconThemeJson',
    /* iconThemeId */ iconThemeId
  )
}

const getExtension = (file) => {
  return file.slice(file.lastIndexOf('.') + 1)
}

export const getFileIcon = (file) => {
  const iconTheme = state.iconTheme
  if (!iconTheme) {
    return ''
  }
  const fileNameIcon = iconTheme.fileNames[file.name.toLowerCase()]
  if (fileNameIcon) {
    return fileNameIcon
  }
  const languageId = Languages.getLanguageId(file.name)
  const languageIcon = iconTheme.languageIds[languageId]
  if (languageIcon) {
    return languageIcon
  }
  const extension = getExtension(file.name)
  const extensionIcon = iconTheme.fileExtensions[extension]
  if (extensionIcon) {
    return extensionIcon
  }
  return '_file'
}

export const getFolderIcon = (folder) => {
  const iconTheme = state.iconTheme
  if (!iconTheme || !iconTheme.folderNames) {
    return ''
  }
  const folderIcon = iconTheme.folderNames[folder.name.toLowerCase()]
  if (folderIcon) {
    return folderIcon
  }
  return '_folder'
}

const getFolderIconExpanded = (folder) => {
  const iconTheme = state.iconTheme
  if (!iconTheme) {
    return ''
  }
  if (!iconTheme.folderNamesExpanded) {
    return '_folder_open'
  }
  const folderName = iconTheme.folderNamesExpanded[folder.name.toLowerCase()]
  if (folderName) {
    return folderName
  }
  return '_folder_open'
}

export const getIcon = (dirent) => {
  switch (dirent.type) {
    case 'file':
      return getFileIcon(dirent)
    case 'directory':
    case 'folder':
      return getFolderIcon(dirent)
    case 'folder-expanded':
    case 'directory-expanded':
      return getFolderIconExpanded(dirent)
    default:
      console.warn(`unsupported type ${dirent.type}`)
      return ''
  }
}

const getBackgroundUrl = (extensionPath, value) => {
  if (Platform.getPlatform() === 'web') {
    return `/file-icons/${value.slice(7)}`
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
  for (const [key, value] of Object.entries(iconTheme.json.iconDefinitions)) {
    const backgroundUrl = getBackgroundUrl(iconTheme.extensionPath, value)
    rules.push(
      `.Icon${key}::before { background-image: url(${backgroundUrl}) }`
    )
  }
  const rulesCss = rules.join('\n')
  return rulesCss
}

export const hydrate = async () => {
  try {
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
    const iconTheme = await getIconThemeJson(iconThemeId)
    state.iconTheme = iconTheme.json
    state.extensionPath = iconTheme.extensionPath

    const iconThemeCss = getIconThemeCss2(iconTheme)
    await RendererProcess.invoke(
      /* Css.setInlineStyle */ 4551,
      /* id */ 'ContributedIconTheme',
      /* css */ iconThemeCss
    )

    await GlobalEventBus.emitEvent('iconTheme.change')
    // GlobalEventBus.addListener('dirents.update', handleDirentsUpdate)
    // GlobalEventBus.addListener('languages.changed', handleLanguagesUpdate)
  } catch (error) {
    // TODO
    console.info(`[info] ${error.message}`)
    // console.error(error)
  }
}
