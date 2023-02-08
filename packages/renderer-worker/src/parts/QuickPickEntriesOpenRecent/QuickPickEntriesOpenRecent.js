import * as Command from '../Command/Command.js'
import * as QuickPickReturnValue from '../QuickPickReturnValue/QuickPickReturnValue.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  SelectToOpen: 'Select to open',
  OpenRecent: 'Open Recent',
  NoRecentlyOpenedFoldersFound: 'No recently opened folders found',
}

const getRecentlyOpened = () => {
  return Command.execute(/* RecentlyOpened.getRecentlyOpened */ 'RecentlyOpened.getRecentlyOpened')
}

const openWorkspaceFolder = (uri) => {
  return Command.execute(/* Workspace.setPath */ 'Workspace.setPath', /* path */ uri)
}

export const getPlaceholder = () => {
  return UiStrings.SelectToOpen
}

export const getLabel = () => {
  return UiStrings.OpenRecent
}

export const getHelpEntries = () => {
  return []
}

export const getNoResults = () => {
  return {
    label: UiStrings.NoRecentlyOpenedFoldersFound,
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
  const path = pick.label
  await openWorkspaceFolder(path)
  return {
    command: QuickPickReturnValue.Hide,
  }
}

export const getFilterValue = (value) => {
  return value
}

export const getPickFilterValue = (pick) => {
  return pick
}

export const getPickLabel = (pick) => {
  return pick
}

export const getPickIcon = (pick) => {
  return ''
}
