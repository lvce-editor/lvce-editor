import * as Command from '../Command/Command.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as Workspace from '../Workspace/Workspace.js'

// TODO maybe create should have a container as param like vscode?
// maybe not?

// const toList = ([fileName, previews]) => [
//   {
//     type: 'fileName',
//     text: `file: ${fileName}`,
//   },
//   ...previews.map(({ preview }) => ({
//     type: 'preview',
//     text: preview,
//   })),
// ]

const SEARCH_ORDER_FILE_NAMES = 1

export const name = 'Search'

export const create = () => {
  return {
    searchResults: [],
    stats: {},
    searchId: -1,
    value: '',
    disposed: false,
    fileCount: 0,
  }
}

export const loadContent = async (state) => {
  return state
}

export const contentLoaded = async () => {}

const getStatusMessage = (resultCount, fileResultCount) => {
  if (resultCount === 0) {
    return 'No results found'
  }
  if (resultCount === 1 && fileResultCount === 1) {
    return 'Found 1 result in 1 file'
  }
  if (fileResultCount === 1) {
    return `Found ${resultCount} results in 1 file`
  }
  return `Found ${resultCount} results in ${fileResultCount} files`
}

const getResultCounts = (results) => {
  let resultCount = 0
  for (const result of results) {
    resultCount += result.length - 1
  }
  return resultCount
}

// TODO
export const setValue = async (state, value) => {
  // state.value = value
  // TODO use Id module
  // state.searchId = Math.random()
  // SharedProcess.send(
  //   /* Search.search */ 907771,
  //   /* id */ state.id,
  //   /* searchId */ state.searchId
  // )
  // TODO
  try {
    const root = Workspace.state.workspacePath
    const results = await TextSearch.textSearch(root, value)
    const displayResults = toDisplayResults(results)
    const resultCount = getResultCounts(results)
    const fileResultCount = results.length
    const message = getStatusMessage(resultCount, fileResultCount)
    return {
      ...state,
      value,
      items: displayResults,
      message,
    }
  } catch (error) {
    return {
      ...state,
      message: `${error}`,
      value,
    }
  }
}

export const handleResult = async (state, result) => {
  if (result.version !== state.version) {
    return
  }
  await RendererProcess.invoke(
    /* viewletInvoke */ 'Viewlet.send',
    /* id */ state.id,
    /* method */ 'handleSearchResult',
    /* result */ result
  )
}

export const dispose = async (state) => {
  // TODO cancel pending search
  if (state.state === 'searching') {
    // TODO this should be invoke
    await SharedProcess.invoke(
      /* Search.cancel */ 'Search.cancel',
      /* searchId */ state.searchId
    )
  }
  return {
    ...state,
    disposed: true,
  }
}

const getPath = (result) => {
  return result[0]
}

const compareResults = (resultA, resultB) => {
  const pathA = getPath(resultA)
  const pathB = getPath(resultB)
  return pathA.localeCompare(pathB)
}

const toDisplayResults = (results) => {
  results.sort(compareResults)
  const displayResults = []
  for (const result of results) {
    const path = getPath(result)
    const absolutePath = Workspace.getAbsolutePath(path)
    displayResults.push({
      path: absolutePath,
      name: path,
    })
  }
  return displayResults
}
// TODO implement virtual list, only send visible items to renderer process

// TODO maybe rename to result.items and result.stats
// TODO support streaming results
// TODO support cancellation
// TODO handle error
// TODO use command.execute or use module directly?
// TODO send results to renderer process
// TODO use virtual list because there might be many results

export const handleInput = async (state, value) => {
  return setValue(state, value)
}

export const handleClick = async (state, index) => {
  const searchResult = state.items[index]
  console.log({ searchResult })
  await Command.execute(
    /* Main.openUri */ 'Main.openUri',
    /* uri */ searchResult.path
  )
  return state
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return oldState.items === newState.items
  },
  apply(oldState, newState) {
    console.log(newState.items)
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'Search',
      /* method */ 'setResults',
      /* results */ newState.items,
      /* resultCount */ newState.items.length,
      /* fileCount */ newState.fileCount,
    ]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'Search',
      /* method */ 'setMessage',
      /* message */ newState.message,
    ]
  },
}

export const render = [renderItems, renderMessage]
