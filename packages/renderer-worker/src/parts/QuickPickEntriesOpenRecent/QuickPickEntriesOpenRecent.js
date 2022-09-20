import * as Command from '../Command/Command.js'

const getRecentlyOpened = () => {
  return Command.execute(
    /* RecentlyOpened.getRecentlyOpened */ 'RecentlyOpened.getRecentlyOpened'
  )
}

const openWorkspaceFolder = (uri) => {
  return Command.execute(
    /* Workspace.setPath */ 'Workspace.setPath',
    /* path */ uri
  )
}

export const getPlaceholder = () => {
  return 'Select to open'
}

export const getLabel = () => {
  return 'Open Recent'
}

export const getHelpEntries = () => {
  return []
}

export const getNoResults = () => {
  return {
    label: 'No recently opened folders found',
  }
}

const toPick = (path) => {
  return {
    label: path,
  }
}

// TODO could also change api so that getPicks returns an array of anything
// and the transformPick gets the label for each pick
// This would make the code more module since the code for getting the picks
// would be more independent of the specific data format of the quickpick provider

export const getPicks = async () => {
  const recentlyOpened = await getRecentlyOpened()
  return recentlyOpened.map(toPick)
}

// TODO selectPick should be independent of show/hide
export const selectPick = async (pick) => {
  const path = pick.label
  await openWorkspaceFolder(path)
  return {
    command: 'hide',
  }
}

export const getFilterValue = (value) => {
  return value
}
