import * as DirentType from '../DirentType/DirentType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as SourceControl from '../SourceControl/SourceControl.js'
import * as Command from '../Command/Command.js'
import * as Bounds from '../Bounds/Bounds.js'
import { getDisplayItems } from './ViewletSourceControlGetDisplayItems.js'

const inlineDiffEditorBreakpoint = 800

const handleClickFile = async (state, item) => {
  const { enabledProviderIds, gitRoot, root } = state
  const providerId = enabledProviderIds[0]
  const absolutePath = `${root}/${item.file}`
  // TODO handle error
  const [fileBefore, fileNow] = await Promise.all([SourceControl.getFileBefore(providerId, item.file), FileSystem.readFile(absolutePath)])
  if (Bounds.get().width < inlineDiffEditorBreakpoint) {
    await Command.execute('Main.openUri', `inline-diff://data://${fileBefore}<->${absolutePath}`)
  } else {
    await Command.execute('Main.openUri', `diff://data://${fileBefore}<->${absolutePath}`)
  }
  return state
}

const handleClickDirectory = (state, item) => {
  const { allGroups } = state
  const isExpanded = true
  const displayItems = getDisplayItems(allGroups, isExpanded)
  return {
    ...state,
    displayItems,
    isExpanded,
  }
}
const handleClickDirectoryExpanded = (state, item) => {
  const { allGroups } = state
  const isExpanded = false
  const displayItems = getDisplayItems(allGroups, isExpanded)
  return {
    ...state,
    displayItems,
    isExpanded,
  }
}

export const handleClick = async (state, index) => {
  const { items } = state
  const item = items[index]
  switch (item.type) {
    case DirentType.Directory:
      return handleClickDirectory(state)
    case DirentType.DirectoryExpanded:
      return handleClickDirectoryExpanded(state)
    case DirentType.File:
      return handleClickFile(state, item)
    default:
      console.warn(`unknown item type: ${item.type}`)
      return state
  }
}
