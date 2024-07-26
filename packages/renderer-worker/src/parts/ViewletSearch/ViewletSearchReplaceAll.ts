import * as GetReplacedAllMessage from '../GetReplacedAllMessage/GetReplacedAllMessage.js'
import * as ReplaceAllAndPrompt from '../ReplaceAllAndPrompt/ReplaceAllAndPrompt.js'

export const replaceAll = async (state) => {
  const { items, replacement, matchCount, fileCount, workspacePath } = state
  const replaced = await ReplaceAllAndPrompt.replaceAllAndPrompt(workspacePath, items, replacement, matchCount, fileCount)
  if (!replaced) {
    return state
  }
  const replacedAllMessage = GetReplacedAllMessage.getReplacedAllMessage(matchCount, fileCount, replacement)
  return {
    ...state,
    fileCount: 0,
    matchCount: 0,
    items: [],
    message: replacedAllMessage,
    minLineY: 0,
    maxLineY: 0,
  }
}
