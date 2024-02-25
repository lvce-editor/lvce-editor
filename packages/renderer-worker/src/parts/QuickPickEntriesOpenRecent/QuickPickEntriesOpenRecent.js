import * as Command from '../Command/Command.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as QuickPickReturnValue from '../QuickPickReturnValue/QuickPickReturnValue.js'
import * as ViewletQuickPickStrings from '../ViewletQuickPick/ViewletQuickPickStrings.js'
import * as Workspace from '../Workspace/Workspace.js'

const getRecentlyOpened = () => {
  return Command.execute(/* RecentlyOpened.getRecentlyOpened */ 'RecentlyOpened.getRecentlyOpened')
}

const openWorkspaceFolder = (uri) => {
  return Command.execute(/* Workspace.setPath */ 'Workspace.setPath', /* path */ uri)
}

export const getPlaceholder = () => {
  return ViewletQuickPickStrings.selectToOpen()
}

export const getLabel = () => {
  return ViewletQuickPickStrings.openRecent()
}

export const getHelpEntries = () => {
  return []
}

export const getNoResults = () => {
  return {
    label: ViewletQuickPickStrings.noRecentlyOpenedFoldersFound(),
  }
}

// TODO could also change api so that getPicks returns an array of anything
// and the transformPick gets the label for each pick
// This would make the code more module since the code for getting the picks
// would be more independent of the specific data format of the quickpick provider

export const getPicks = async () => {
  const recentlyOpened = await getRecentlyOpened()
  return recentlyOpened
}

// TODO selectPick should be independent of show/hide
export const selectPick = async (pick) => {
  const path = pick
  await openWorkspaceFolder(path)
  return {
    command: QuickPickReturnValue.Hide,
  }
}

export const getFilterValue = (value) => {
  return Workspace.pathBaseName(value)
}

export const getPickFilterValue = (pick) => {
  return Workspace.pathBaseName(pick)
}

export const getPickLabel = (pick) => {
  return Workspace.pathBaseName(pick)
}

export const getPickDescription = (pick) => {
  return Workspace.pathDirName(pick)
}

export const getPickIcon = () => {
  return ''
}

export const getPickFileIcon = (pick) => {
  const baseName = Workspace.pathBaseName(pick)
  return IconTheme.getFolderIcon({ name: baseName })
}
