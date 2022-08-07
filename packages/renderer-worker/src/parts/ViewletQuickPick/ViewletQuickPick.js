import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as FuzzySearch from '../FuzzySearch/FuzzySearch.js'
import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as QuickPickEveryThing from '../QuickPick/QuickPickEverything.js'

// TODO send open signal to renderer process before items are ready
// that way user can already type while items are still loading

// TODO cache quick pick items -> don't send every time from renderer worker to renderer process
// maybe cache by id opening commands -> has all commands cached
// when filtering -> sends all indices (uint16Array) to renderer process instead of filtered/sorted command objects

const RECENT_PICKS_MAX_SIZE = 3
const ITEM_HEIGHT = 22

// state:
// 1. default
// 2. creating (input is ready, but there are no items yet)
// 3. finished

const QuickPickState = {
  Default: 0,
  Creating: 1,
  Finished: 2,
}

export const name = 'QuickPick'

export const create = () => {
  return {
    state: QuickPickState.Default,
    picks: [],
    filteredPicks: [],
    recentPicks: [],
    recentPickIds: new Map(), // TODO use object.create(null) instead
    versionId: 0,
    provider: QuickPickEveryThing, // TODO make this dynamic again
    focusedIndex: 0,
    warned: [],
    visiblePicks: [],
    minLineY: 0,
    maxLineY: 0,
    maxVisibleItems: 10,
  }
}

// TODO naming for provider.getNoResults is a bit weird

const filterPicks = (state, picks, exclude, value) => {
  // TODO every pick should have label
  const filterPick = (pick) => {
    if (exclude.has(pick.id)) {
      return false
    }
    if (!pick.label && !state.warned.includes(JSON.stringify(pick))) {
      console.warn('[QuickPick] item has missing label', pick)
      state.warned.push(JSON.stringify(pick))
      return false
    }
    const labelMatch = FuzzySearch.fuzzySearch(value, pick.label || pick.id)
    if (labelMatch) {
      return labelMatch
    }
    // TODO also filtering for aliases might be expensive
    // TODO maybe only filter for aliases if prefix is longer than 4-5 characters
    // otherwise both will be found anyway
    // e.g. "Relo" matches  "Window Reload"  and "Reload Window"
    // But "Reload Win" only matches "Reload Window"
    if (pick.aliases) {
      for (const alias of pick.aliases) {
        if (FuzzySearch.fuzzySearch(value, alias)) {
          return true
        }
      }
    }
    return false
  }
  const filteredPicks = picks.filter(filterPick)
  return filteredPicks
}

const slicePicks = (filteredPicks) => {
  return filteredPicks.slice(0, 10)
}

const toDisplayPicks = (picks) => {
  const toDisplayPick = (pick, index) => {
    return {
      label: pick.label,
      posInSet: index + 1,
      setSize: picks.length,
    }
  }
  return picks.map(toDisplayPick)
}

const getVisiblePicks = (state, picks, filterValue) => {
  Assert.object(state)
  Assert.array(picks)
  Assert.string(filterValue)
  const filteredPicks = filterPicks(
    state,
    picks,
    state.recentPickIds,
    filterValue
  )
  state.filteredPicks = filteredPicks
  state.state = QuickPickState.Finished
  const slicedPicks = slicePicks(filteredPicks)
  return toDisplayPicks(slicedPicks)
}

// TODO have lazy loadable provider as argument
export const loadContent = async (state) => {
  const value = ''
  const provider = state.provider
  if (state.state === QuickPickState.Finished) {
    const version = ++state.versionId
    // TODO if provider is immutable, don't necessarily need to get new picks
    const newPicks = await provider.getPicks(value)
    Assert.array(newPicks)
    if (version !== state.versionId) {
      return
    }
    const filterValue = provider.getFilterValue(value)
    const visiblePicks = getVisiblePicks(state, newPicks, filterValue)
    const placeholder = provider.getPlaceholder()
    const label = provider.getLabel()

    const minLineY = 0
    const maxLineY = Math.min(
      minLineY + state.maxVisibleItems,
      newPicks.length - 1
    )
    return {
      ...state,
      picks: newPicks,
      visiblePicks,
      focusedIndex: 0,
      state: QuickPickState.Finished,
    }
  }
  state.state = QuickPickState.Creating
  const version = ++state.versionId
  // TODO also pass initial value here
  await RendererProcess.invoke(
    /* Viewlet.load */ 'Viewlet.load',
    /* id */ 'QuickPick'
  )
  const newPicks = await provider.getPicks(value)
  Assert.array(newPicks)
  if (version !== state.versionId) {
    return
  }
  if (newPicks.length === 0) {
    const noResults = await provider.getNoResults()
    RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'showNoResults',
      /* noResults */ noResults,
      /* unfocusIndex */ state.focusedIndex
    )
    return
  }
  const filterValue = provider.getFilterValue(value)
  const visiblePicks = getVisiblePicks(state, newPicks, filterValue)
  const placeholder = provider.getPlaceholder()
  const label = provider.getLabel()
  const minLineY = 0
  const maxLineY = Math.min(
    minLineY + state.maxVisibleItems,
    newPicks.length - 1
  )
  return {
    ...state,
    picks: newPicks,
    visiblePicks,
    focusedIndex: 0,
    state: QuickPickState.Finished,
    minLineY,
    maxLineY,
  }
}

export const contentLoaded = () => {}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const handleBlur = async (state) => {
  switch (state.state) {
    case QuickPickState.Default:
    case QuickPickState.Creating:
      break
    case QuickPickState.Finished:
      await dispose()
      break
    default:
      break
  }
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

export const selectIndex = async (state, index, button = /* left */ 0) => {
  const pick = getPick(state, index)
  const versionBefore = state.versionId
  const selectPickResult = await state.provider.selectPick(pick, index, button)
  Assert.object(selectPickResult)
  Assert.string(selectPickResult.command)
  const { command } = selectPickResult
  const versionAfter = state.versionId
  if (versionBefore !== versionAfter) {
    // selecting a pick might have opened another quick pick
    // so there is no need to hide the quick pick
    return
  }
  switch (command) {
    case 'hide':
      dispose()
      break
    default:
      break
  }

  // TODO recent picks should be per provider
  // if (!state.recentPickIds.has(pick.id)) {
  //   state.recentPicks.unshift(pick)
  //   state.recentPickIds.add(pick.id)
  // }
  // if (state.recentPicks.length > RECENT_PICKS_MAX_SIZE) {
  //   const last = state.recentPicks.pop()
  //   state.recentPickIds.delete(last.id)
  // }
}

export const selectCurrentIndex = async (state) => {
  await selectIndex(state.focusedIndex)
}

// TODO when user types letters -> no need to query provider again -> just filter existing results
export const handleInput = async (state, value) => {
  console.log({ value })
  if (state.state === QuickPickState.Default) {
    return
  }
  state.state = QuickPickState.Creating
  const version = ++state.versionId
  // TODO if provider is immutable, don't necessarily need to get new picks
  const newPicks = await state.provider.getPicks(value)
  if (version !== state.versionId) {
    return
  }
  const filterValue = state.provider.getFilterValue(value)
  const visiblePicks = getVisiblePicks(state, newPicks, filterValue)

  RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'QuickPick',
    /* method */ 'updatePicks',
    /* picks */ visiblePicks,
    /* unFocusIndex */ state.focusedIndex
  )
  state.picks = newPicks
  state.visiblePicks = visiblePicks
  state.focusedIndex = 0
  state.state = QuickPickState.Finished
}

// TODO use reactive Programming
// https://angular-2-training-book.rangle.io/http/search_with_switchmap

// searchField.valuesChanges.debounceTime(400).switchMap(term => search(term)).subscribe(result => {
//   sendRendererProcess(result)
// })
// merge(openStream, closeStream, updateStream).switchMap(state => {
//   switch(state){
//     case 'default':
//
// }
//
// })

export const focusIndex = async (state, index) => {
  // TODO get types working
  // @ts-ignore
  if (state.provider.focusPick) {
    // @ts-ignore
    await state.provider.focusPick(state.filteredPicks[index])
  }
  console.log({ index, maxLineY: state.maxLineY })
  if (index < state.minLineY) {
    const minLineY = index
    const maxLineY = Math.min(
      index + state.maxVisibleItems,
      state.filteredPicks.length - 1
    )
    const slicedPicks = state.filteredPicks.slice(
      state.minLineY,
      state.maxLineY
    )
    const displayPicks = toDisplayPicks(slicedPicks)
    const relativeFocusIndex = index - state.minLineY
    const relativeUnFocusIndex = state.focusedIndex - state.minLineY
    // TODO need to scroll up
    return {
      ...state,
      minLineY,
      maxLineY,
      displayPicks,
      focusedIndex: index,
    }
  }
  if (index > state.maxLineY) {
    // TODO need to scroll down
    const minLineY = Math.max(0, index - state.maxVisibleItems)
    const maxLineY = Math.min(
      index + state.maxVisibleItems - 1,
      state.filteredPicks.length - 1
    )
    const slicedPicks = state.filteredPicks.slice(
      state.minLineY,
      state.maxLineY
    )
    console.log(
      'scroll down',
      index,
      state.minLineY,
      state.maxLineY,
      slicedPicks
    )
    const displayPicks = toDisplayPicks(slicedPicks)
    const relativeFocusIndex = index - state.minLineY
    const relativeUnFocusIndex = state.focusedIndex - state.minLineY
    return {
      ...state,
      displayPicks,
      minLineY,
      maxLineY,
      focusedIndex: index,
    }
  }
  return {
    ...state,
    focusedIndex: index,
  }
}

export const focusFirst = (state) => {
  return focusIndex(state, 0)
}

export const focusLast = (state) => {
  return focusIndex(state, state.filteredPicks.length - 1)
}

export const focusPrevious = (state) => {
  const previousIndex =
    state.focusedIndex === 0
      ? state.filteredPicks.length - 1
      : state.focusedIndex - 1
  return focusIndex(state, previousIndex)
}

export const focusNext = (state) => {
  const nextIndex = (state.focusedIndex + 1) % state.filteredPicks.length
  return focusIndex(state, nextIndex)
}

// TODO not sure these should be in this file
export const openCommandPalette = async () => {
  const QuickPickEverything = await import('./QuickPickEverything.js')
  await show('>', QuickPickEverything)
}

export const openEverythingQuickPick = async () => {
  const QuickPickEverything = await import('./QuickPickEverything.js')
  await show('', QuickPickEverything)
}

export const openGoToLine = async () => {
  const QuickPickEverything = await import('./QuickPickEverything.js')
  await show(':', QuickPickEverything)
}

export const openView = async () => {
  await show('view ')
}

export const openColorTheme = async () => {
  const QuickPickColorTheme = await import('./QuickPickColorTheme.js')
  await show('', QuickPickColorTheme)
}

export const fileOpenRecent = async () => {
  const QuickPickOpenRecent = await import('./QuickPickOpenRecent.js')
  await show('', QuickPickOpenRecent)
}

export const showExtensionsQuickPick = async (items) => {
  Assert.array(items)
  // TODO handle error, promise swallows error
  const provider = {
    getPicks() {
      return items
    },
    async selectPick(item, index) {
      const ExtensionHost = await import(
        '../ExtensionHost/ExtensionHostCore.js'
      )
      await ExtensionHost.invoke(
        /* ExtensionHostQuickPick.handleQuickPickResult */ 'ExtensionHostQuickPick.handleQuickPickResult',
        /* index */ index
      )
      return {
        command: 'hide',
      }
    },
    getFilterValue(value) {
      return value
    },
    getPlaceholder() {
      return ''
    },
    getLabel() {
      return 'extension pick'
    },
  }
  await show('', provider)
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  console.log({ oldState, newState })
  const commands = []
  if (oldState.value !== newState.value) {
  }
  return []
}
