import * as FileSystem from '../FileSystem/FileSystem.js'
import * as SourceControl from '../SourceControl/SourceControl.js'
import { getDisplayItems } from './ViewletSourceControlGetDisplayItems.js'

const handleClickFile = async (state, item) => {
  const absolutePath = `${state.gitRoot}/${item.file}`
  // TODO handle error
  const [fileBefore, fileNow] = await Promise.all([SourceControl.getFileBefore(item.file), FileSystem.readFile(absolutePath)])
  const content = `before:\n${fileBefore}\n\n\nnow:\n${fileNow}`
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
  const { displayItems } = state
  const item = displayItems[index]
  console.log('type', item.type)
  switch (item.type) {
    case 'directory':
      return handleClickDirectory(state)
    case 'directory-expanded':
      return handleClickDirectoryExpanded(state)
    case 'file':
      return handleClickFile(state, item)
    default:
      console.warn(`unknown item type: ${item.type}`)
      return state
  }
}
