import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as IncrementalTextSearch from '../IncrementalTextSearch/IncrementalTextSearch.js'
import * as IsEmptyString from '../IsEmptyString/IsEmptyString.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Id from '../Id/Id.js'
import * as ViewletSearchStatusMessage from './ViewletSearchStatusMessage.js'

const getResultCounts = (results) => {
  let resultCount = 0
  let fileCount = 0
  for (const result of results) {
    switch (result.type) {
      case TextSearchResultType.File:
        fileCount++
        break
      case TextSearchResultType.Match:
        resultCount++
        break
      default:
        break
    }
  }
  return { fileCount, resultCount }
}

const parseLine = (line) => {
  if (!line) {
    return {}
  }
  return JSON.parse(line)
}

const parseData = (data) => {
  const lines = data.split('\n')
  const parsed = []
  for (const line of lines) {
    parsed.push(parseLine(line))
  }
  return parsed
}

class DataEvent extends Event {
  constructor(parsed) {
    super('parsedData', {})
    this.parsed = parsed
  }
}

class ImprovedTextSearch extends EventTarget {
  constructor(emitter) {
    super()
    this.buffer = ''
    emitter.addEventListener('data', this.handleData.bind(this))
  }

  handleData(event) {
    console.log({ event })
    const data = event.data
    const parsed = parseData(data)
    console.log('dispatch')
    this.dispatchEvent(new DataEvent(parsed))
  }
}

export const handleUpdate = async (state, update) => {
  const partialNewState = { ...state, ...update }
  try {
    const { height, itemHeight, minimumSliderSize, headerHeight, matchCase, value, threads } = partialNewState
    if (IsEmptyString.isEmptyString(value)) {
      return {
        ...partialNewState,
        minLineY: 0,
        maxLineY: 0,
        deltaY: 0,
        items: [],
        matchIndex: 0,
        matchCount: 0,
        message: '',
      }
    }
    IncrementalTextSearch.cancel(state.searchId)
    const root = Workspace.state.workspacePath
    state.searchId = Id.create()
    const search = IncrementalTextSearch.start(state.searchId, {
      root,
      value,
      threads,
      isCaseSensitive: matchCase,
      query: value,
    })
    const improvedSearch = new ImprovedTextSearch(search)

    const handleResult = (event) => {
      console.log('HANDLE RESULT')
      const parsed = event.parsed
      console.log({ parsed })
    }
    improvedSearch.addEventListener('parsedData', handleResult)
    // improvedSearch.addEventListener('', callback)
    const results = await TextSearch.textSearch(root, value, {
      threads,
      isCaseSensitive: matchCase,
    })
    if (!Array.isArray(results)) {
      throw new Error(`results must be of type array`)
    }
    const { fileCount, resultCount } = getResultCounts(results)
    // const displayResults = toDisplayResults(results, itemHeight, resultCount, value)
    const message = ViewletSearchStatusMessage.getStatusMessage(resultCount, fileCount)
    const total = results.length
    const contentHeight = total * itemHeight
    const listHeight = height - headerHeight
    const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(height, contentHeight, minimumSliderSize)
    const numberOfVisible = Math.ceil(listHeight / itemHeight)
    const maxLineY = Math.min(numberOfVisible, total)
    const finalDeltaY = Math.max(contentHeight - listHeight, 0)
    return {
      ...partialNewState,
      value,
      items: results,
      message,
      maxLineY: maxLineY,
      scrollBarHeight,
      finalDeltaY,
      threads,
      fileCount,
      matchCount: resultCount,
    }
  } catch (error) {
    ErrorHandling.logError(error)
    return {
      ...partialNewState,
      message: `${error}`,
      items: [],
      matchCount: 0,
      fileCount: 0,
      minLineY: 0,
      maxLineY: 0,
    }
  }
}
