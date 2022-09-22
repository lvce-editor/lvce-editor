import * as QuickPickNoop from '../QuickPickEntriesNoop/QuickPickNoop.js'
import * as QuickPickPrefix from '../QuickPIckPrefix/QuickPickPrefix.js'

// TODO cache quick pick items -> don't send every time from renderer worker to renderer process
// maybe cache by id opening commands -> has all commands cached
// when filtering -> sends all indices (uint16Array) to renderer process instead of filtered/sorted command objects

const RECENT_PICKS_MAX_SIZE = 3

// TODO avoid global variable

export const state = {
  // providerId: PROVIDER_NOOP,
  provider: QuickPickNoop,
  prefix: 'string-that-should-never-match-another-string',
}

/**
 * @type {string}
 */
export const name = 'everything'

export const getPlaceholder = () => {
  return state.provider.getPlaceholder()
}

export const getLabel = () => {
  return ''
}

export const getHelpEntries = () => {
  return state.provider.getHelpEntries()
}

export const getNoResults = () => {
  return state.provider.getNoResults()
}

const getPrefix = (value) => {
  if (value.startsWith(QuickPickPrefix.Command)) {
    return QuickPickPrefix.Command
  }
  if (value.startsWith(QuickPickPrefix.Symbol)) {
    return QuickPickPrefix.Symbol
  }
  if (value.startsWith(QuickPickPrefix.WorkspaceSymbol)) {
    return QuickPickPrefix.WorkspaceSymbol
  }
  if (value.startsWith(QuickPickPrefix.GoToLine)) {
    return QuickPickPrefix.GoToLine
  }
  if (value.startsWith(QuickPickPrefix.View)) {
    return QuickPickPrefix.View
  }
  return QuickPickPrefix.None
}

const getQuickPickProvider = (prefix) => {
  // TODO could use enum for prefix
  // TODO could use regex to extract prefix
  // TODO or could check first letter char code (less comparisons)
  switch (prefix) {
    case QuickPickPrefix.Command:
      return import('../QuickPickEntriesCommand/QuickPickEntriesCommand.js')
    case QuickPickPrefix.Symbol:
      return import('../QuickPickEntriesSymbol/QuickPickEntriesSymbol.js')
    case QuickPickPrefix.WorkspaceSymbol:
      return import(
        '../QuickPickEntriesWorkspaceSymbol/QuickPickEntriesWorkspaceSymbol.js'
      )
    case QuickPickPrefix.GoToLine:
      return import('../QuickPickEntriesGoToLine/QuickPickEntriesGoToLine.js')
    case QuickPickPrefix.View:
      return import('../QuickPickEntriesView/QuickPickEntriesView.js')
    default:
      return import('../QuickPickEntriesFile/QuickPickEntriesFile.js')
  }
}

export const getPicks = async (value) => {
  const prefix = getPrefix(value)
  // TODO race condition
  if (state.prefix !== prefix) {
    state.prefix = prefix
    // @ts-ignore
    state.provider = await getQuickPickProvider(prefix)
    console.log('set provider', state.provider)
  }
  console.log('get picks here')
  // TODO this line is a bit duplicated with getFilterValue
  const slicedValue = value.slice(prefix.length)
  const picks = await state.provider.getPicks(slicedValue)
  return picks
}

const getPick = (state, index) => {
  // if (index < state.recentPicks.length) {
  //   return state.recentPicks[index]
  // }
  // index -= state.recentPicks.length
  if (index < state.filteredPicks.length) {
    return state.filteredPicks[index]
  }
  console.warn('no pick matching index', index)
}

export const selectPick = (item) => {
  const { provider } = state
  console.log('select pick', provider)
  return provider.selectPick(item)
}

export const openCommandPalette = () => {
  // show('>')
}

export const openView = () => {
  // show('view ')
}

export const getFilterValue = (value) => {
  return value.slice(state.prefix.length)
}
