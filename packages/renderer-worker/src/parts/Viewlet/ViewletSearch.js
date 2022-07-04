import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Command from '../Command/Command.js'
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

export const setValue = (state, value) => {
  state.value = value
  // TODO use Id module
  state.searchId = Math.random()
  SharedProcess.send(
    /* Search.search */ 907771,
    /* id */ state.id,
    /* searchId */ state.searchId
  )
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

export const handleInput = async (state, value) => {
  // TODO support streaming results
  // TODO support cancellation
  // TODO handle error
  // TODO use command.execute or use module directly?
  const results = await Command.execute(
    /* FindInWorkspace.findInWorkspace */ 5200,
    /* searchTerm */ value
  )
  // TODO send results to renderer process
  // TODO use virtual list because there might be many results
  console.log({
    value,
    results,
  })

  // TODO implement virtual list, only send visible items to renderer process

  // TODO maybe rename to result.items and result.stats
  const displayResults = toDisplayResults(results.results)
  return {
    ...state,
    searchResults: displayResults,
    fileCount: results.results.length, // TODO this is weird
  }
}

export const handleClick = async (state, index) => {
  const searchResult = state.searchResults[index]
  console.log({ searchResult })
  await Command.execute(
    /* Main.openUri */ 'Main.openUri',
    /* uri */ searchResult.path
  )
}

export const resize = (state, dimensions) => {
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands: [],
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  console.log('RENDER')
  const changes = []
  if (oldState.searchResults !== newState.searchResults) {
    changes.push([
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'Search',
      /* method */ 'setResults',
      /* results */ newState.searchResults,
      /* resultCount */ newState.searchResults.length,
      /* fileCount */ newState.fileCount,
    ])
  }
  return changes
}
