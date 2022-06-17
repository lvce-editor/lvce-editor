import * as QuickPickNoop from './QuickPickNoop.js'

// TODO cache quick pick items -> don't send every time from renderer worker to renderer process
// maybe cache by id opening commands -> has all commands cached
// when filtering -> sends all indices (uint16Array) to renderer process instead of filtered/sorted command objects

const RECENT_PICKS_MAX_SIZE = 3

// const PROVIDER_NOOP = 0
// const PROVIDER_COMMAND = 1
// const PROVIDER_SYMBOL = 2
// const PROVIDER_WORKSPACE_SYMBOL = 3
// const PROVIDER_GO_TO_LINE = 4
// const PROVIDER_VIEW = 5

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
  if (value.startsWith('>')) {
    return '>'
  }
  if (value.startsWith('@')) {
    return '@'
  }
  if (value.startsWith('#')) {
    return '#'
  }
  if (value.startsWith(':')) {
    return ':'
  }
  if (value.startsWith('view ')) {
    return 'view '
  }
  return ''
}

const getQuickPickProvider = (prefix) => {
  // TODO could use enum for prefix
  // TODO could use regex to extract prefix
  // TODO or could check first letter char code (less comparisons)
  switch (prefix) {
    case '>':
      return import('./QuickPickCommand.js')
    case '@':
      return import('./QuickPickSymbol.js')
    case '#':
      return import('./QuickPickWorkspaceSymbol.js')
    case ':':
      return import('./QuickPickGoToLine.js')
    case 'view':
      return import('./QuickPickView.js')
    default:
      return import('./QuickPickFile.js')
  }
}

export const getPicks = async (value) => {
  const prefix = getPrefix(value)
  // TODO race condition
  if (state.prefix !== prefix) {
    state.prefix = prefix
    // @ts-ignore
    state.provider = await getQuickPickProvider(prefix)
  }
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
  return state.provider.selectPick(item)
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
