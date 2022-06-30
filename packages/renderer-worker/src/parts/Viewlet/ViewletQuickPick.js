import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as FuzzySearch from '../FuzzySearch/FuzzySearch.js'
import * as Assert from '../Assert/Assert.js'

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

const STATE_DEFAULT = 0
const STATE_CREATING = 1
const STATE_FINISHED = 2

export const create = (getProvider) => {
  return {
    state: STATE_DEFAULT,
    picks: [],
    filteredPicks: [],
    versionId: 0,
    provider: undefined,
    focusedIndex: 0,
    warned: [],
    visiblePicks: [],
    minLineY: 0,
    maxLineY: 0,
    maxVisibleItems: 10,
  }
}

// TODO naming for provider.getNoResults is a bit weird

const filterPicks = (picks, exclude, value) => {
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

const getVisiblePicks = (picks, filterValue) => {
  const filteredPicks = filterPicks(picks, state.recentPickIds, filterValue)
  state.filteredPicks = filteredPicks
  state.state = STATE_FINISHED
  const slicedPicks = slicePicks(filteredPicks)
  return toDisplayPicks(slicedPicks)
}

// TODO have lazy loadable provider as argument
export const show = async (value, provider) => {
  state.provider = provider
  if (state.state === STATE_FINISHED) {
    const version = ++state.versionId
    // TODO if provider is immutable, don't necessarily need to get new picks
    const newPicks = await provider.getPicks(value)
    Assert.array(newPicks)
    if (version !== state.versionId) {
      return
    }
    const filterValue = provider.getFilterValue(value)
    const visiblePicks = getVisiblePicks(newPicks, filterValue)
    const placeholder = provider.getPlaceholder()
    RendererProcess.send([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'updateValueAndPicksAndPlaceholder',
      /* value */ value,
      /* picks */ visiblePicks,
      /* focusIndex */ 0,
      /* unFocusIndex */ state.focusedIndex,
      /* placeholder */ placeholder,
    ])
    state.picks = newPicks
    state.visiblePicks = visiblePicks
    state.focusedIndex = 0
    state.state = STATE_FINISHED
    state.minLineY = 0
    state.maxLineY = Math.min(
      state.minLineY + state.maxVisibleItems,
      newPicks.length - 1
    )
    return
  }
  state.state = STATE_CREATING
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
    RendererProcess.send([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'showNoResults',
      /* noResults */ noResults,
      /* unfocusIndex */ state.focusedIndex,
    ])
    return
  }
  const visiblePicks = getVisiblePicks(newPicks, '')
  state.visiblePicks = visiblePicks
  state.state = STATE_FINISHED
  state.minLineY = 0
  state.maxLineY = Math.min(
    state.minLineY + state.maxVisibleItems,
    newPicks.length - 1
  )
  RendererProcess.send([
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'QuickPick',
    /* method */ 'setValueAndPicks',
    /* value */ value,
    /* picks */ visiblePicks,
  ])
  state.focusedIndex = 0
}

export const dispose = () => {
  switch (state.state) {
    case STATE_DEFAULT:
    case STATE_CREATING:
      break
    case STATE_FINISHED:
      state.state = STATE_DEFAULT
      RendererProcess.send([
        /* Viewlet.dispose */ 'Viewlet.dispose',
        /* id */ 'QuickPick',
      ])
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

export const selectIndex = async (index, button = /* left */ 0) => {
  const pick = getPick(state, index)
  const versionBefore = state.versionId
  const selectPickResult = await state.provider.selectPick(pick, button)
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

export const selectCurrentIndex = async () => {
  await selectIndex(state.focusedIndex)
}

// TODO when user types letters -> no need to query provider again -> just filter existing results
export const handleInput = async (value) => {
  if (state.state === STATE_DEFAULT) {
    return
  }
  state.state = STATE_CREATING
  const version = ++state.versionId
  // TODO if provider is immutable, don't necessarily need to get new picks
  const newPicks = await state.provider.getPicks(value)
  if (version !== state.versionId) {
    return
  }
  const filterValue = state.provider.getFilterValue(value)
  const visiblePicks = getVisiblePicks(newPicks, filterValue)

  RendererProcess.send([
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'QuickPick',
    /* method */ 'updatePicks',
    /* picks */ visiblePicks,
    /* unFocusIndex */ state.focusedIndex,
  ])
  state.picks = newPicks
  state.visiblePicks = visiblePicks
  state.focusedIndex = 0
  state.state = STATE_FINISHED
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

export const focusIndex = async (index) => {
  console.log({ index, maxLineY: state.maxLineY })
  if (index < state.minLineY) {
    state.minLineY = index
    state.maxLineY = Math.min(
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
    RendererProcess.send([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'updateValueAndPicks', // TODO don't need to update value, just picks and focus
      /* value */ state.value,
      /* visiblePicks */ displayPicks,
      /* focusIndex */ relativeFocusIndex,
      /* unFocusIndex */ relativeUnFocusIndex,
    ])
    // TODO need to scroll up
  } else if (index > state.maxLineY) {
    // TODO need to scroll down
    state.minLineY = Math.max(0, index - state.maxVisibleItems)
    state.maxLineY = Math.min(
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
    console.log({
      relativeFocusIndex,
      relativeUnFocusIndex,
    })
    RendererProcess.send([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'updateValueAndPicks', // TODO don't need to update value, just picks and focus
      /* value */ state.value,
      /* visiblePicks */ displayPicks,
      /* focusIndex */ relativeFocusIndex,
      /* unFocusIndex */ relativeUnFocusIndex,
    ])
  } else {
    RendererProcess.send([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'focusIndex',
      /* unFocusIndex */ state.focusedIndex,
      /* index */ index,
    ])
  }

  state.focusedIndex = index
  // TODO get types working
  // @ts-ignore
  if (state.provider.focusPick) {
    // @ts-ignore
    await state.provider.focusPick(state.filteredPicks[index])
  }
}

export const focusFirst = async () => {
  await focusIndex(0)
}

export const focusLast = async () => {
  await focusIndex(state.filteredPicks.length - 1)
}

export const focusPrevious = async () => {
  const previousIndex =
    state.focusedIndex === 0
      ? state.filteredPicks.length - 1
      : state.focusedIndex - 1
  await focusIndex(previousIndex)
}

export const focusNext = async () => {
  const nextIndex = (state.focusedIndex + 1) % state.filteredPicks.length
  await focusIndex(nextIndex)
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
