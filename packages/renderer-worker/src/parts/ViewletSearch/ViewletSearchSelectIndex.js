import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as Workspace from '../Workspace/Workspace.js'

const getFileIndex = (items, index) => {
  for (let i = index; i >= 0; i--) {
    const item = items[i]
    if (item.type === TextSearchResultType.File) {
      return i
    }
  }
  return -1
}

const selectIndexFile = async (state, searchResult, index) => {
  const path = Workspace.getAbsolutePath(searchResult.text)
  Assert.string(path)
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ path)
  return state
}

const selectIndexPreview = async (state, searchResult, index) => {
  const { items } = state
  const fileIndex = getFileIndex(items, index)
  if (fileIndex === -1) {
    throw new Error('Search result is missing file')
  }
  const { lineNumber } = searchResult
  // console.log({ searchResult })
  const fileResult = items[fileIndex]
  const path = Workspace.getAbsolutePath(fileResult.text)
  Assert.string(path)
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ path, /* focus */ true, {
    selections: new Uint32Array([lineNumber, 0, lineNumber, 0]),
  })
  return state
}

export const selectIndex = (state, index) => {
  if (index === -1) {
    return {
      ...state,
      listFocused: true,
      listFocusedIndex: -1,
    }
  }
  const { items } = state
  const searchResult = items[index]
  switch (searchResult.type) {
    case TextSearchResultType.File:
      return selectIndexFile(state, searchResult, index)
    case TextSearchResultType.Match:
      return selectIndexPreview(state, searchResult, index)
    default:
      throw new Error(`unexpected search result type ${searchResult.type}`)
  }
}
