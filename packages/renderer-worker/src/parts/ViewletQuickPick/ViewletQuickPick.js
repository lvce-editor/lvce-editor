import * as Assert from '../Assert/Assert.js'
import * as BeforeInput from '../BeforeInput/BeforeInput.js'
import * as FuzzySearch from '../FuzzySearch/FuzzySearch.js'
import * as QuickPickEntries from '../QuickPickEntries/QuickPickEntries.js'
import * as QuickPickEveryThing from '../QuickPickEntriesEverything/QuickPickEntriesEverything.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as QuickPickReturnValue from '../QuickPickReturnValue/QuickPickReturnValue.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

// TODO send open signal to renderer process before items are ready
// that way user can already type while items are still loading

// TODO cache quick pick items -> don't send every time from renderer worker to renderer process
// maybe cache by id opening commands -> has all commands cached
// when filtering -> sends all indices (uint16Array) to renderer process instead of filtered/sorted command objects

// state:
// 1. default
// 2. creating (input is ready, but there are no items yet)
// 3. finished

const QuickPickState = {
  Default: 0,
  Creating: 1,
  Finished: 2,
}

export const name = ViewletModuleId.QuickPick

export const create = (id, uri, top, left, width, height) => {
  return {
    state: QuickPickState.Default,
    picks: [],
    items: [],
    recentPicks: [],
    recentPickIds: new Map(), // TODO use object.create(null) instead
    versionId: 0,
    provider: QuickPickEveryThing, // TODO make this dynamic again
    focusedIndex: -1,
    warned: [],
    visiblePicks: [],
    minLineY: 0,
    maxLineY: 0,
    maxVisibleItems: 10,
    uri,
    cursorOffset: 0,
    deltaY: 0,
    itemHeight: 22,
    height: 300,
    headerHeight: 30,
    top: 50,
    width: 600,
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
    // otherwise both will be found anywayf
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
  const items = picks.filter(filterPick)
  return items
}

const getVisible = (items, minLineY, maxLineY) => {
  const visibleItems = []
  const setSize = items.length
  const max = Math.min(items.length, maxLineY)
  for (let i = minLineY; i < max; i++) {
    const item = items[i]
    visibleItems.push({
      label: item.label,
      icon: item.icon,
      posInSet: i + 1,
      setSize,
    })
  }
  return visibleItems
}

const getFilteredItems = (state, picks, filterValue) => {
  Assert.object(state)
  Assert.array(picks)
  Assert.string(filterValue)
  const items = filterPicks(state, picks, state.recentPickIds, filterValue)
  return items
  // TODO avoid mutation
  // state.items = items
  // const slicedPicks = slicePicks(items)
  // return toDisplayPicks(slicedPicks)
}

const getDefaultValue = (uri) => {
  switch (uri) {
    case 'quickPick://everything':
      return '>'
    default:
      return ''
  }
}

export const loadContent = async (state) => {
  const uri = state.uri
  const value = getDefaultValue(uri)
  const provider = await QuickPickEntries.load(uri)
  const newPicks = await provider.getPicks(value)
  Assert.array(newPicks)
  // @ts-ignore
  const filterValue = provider.getFilterValue(value)
  const items = getFilteredItems(state, newPicks, filterValue)
  const placeholder = provider.getPlaceholder()
  // @ts-ignore
  const label = provider.getLabel()
  const minLineY = 0
  const maxLineY = Math.min(
    minLineY + state.maxVisibleItems,
    newPicks.length - 1
  )
  return {
    ...state,
    picks: newPicks,
    items,
    focusedIndex: 0,
    state: QuickPickState.Finished,
    minLineY,
    maxLineY,
    value,
    cursorOffset: value.length,
    provider,
  }
}

export const contentLoaded = () => {}

export const dispose = (state) => {
  return state
}

export const handleBlur = async (state) => {
  await Viewlet.closeWidget('QuickPick')
  return state
}

const getPick = (items, index) => {
  Assert.array(items)
  Assert.number(index)
  // if (index < state.recentPicks.length) {
  //   return state.recentPicks[index]
  // }
  // index -= state.recentPicks.length
  if (index < items.length) {
    return items[index]
  }
  console.warn('no pick matching index', index)
}

const findLabelIndex = (items, label) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].label === label) {
      return i
    }
  }
  return -1
}

export const selectItem = (state, label) => {
  Assert.string(label)
  const index = findLabelIndex(state.items, label)
  if (index === -1) {
    return state
  }
  return selectIndex(state, index)
}

export const selectIndex = async (state, index, button = /* left */ 0) => {
  const { minLineY, provider, items } = state
  const actualIndex = index + minLineY
  const pick = getPick(items, actualIndex)
  const selectPickResult = await provider.selectPick(pick, actualIndex, button)
  Assert.object(selectPickResult)
  Assert.string(selectPickResult.command)
  const { command } = selectPickResult
  switch (command) {
    case QuickPickReturnValue.Hide:
      await Viewlet.closeWidget(ViewletModuleId.QuickPick)
      return state
    default:
      return state
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

export const selectCurrentIndex = (state) => {
  return selectIndex(state, state.focusedIndex)
}

// TODO when user types letters -> no need to query provider again -> just filter existing results
export const handleInput = async (state, newValue, cursorOffset) => {
  if (state.value === newValue) {
    return state
  }
  const newPicks = await state.provider.getPicks(newValue)
  const filterValue = state.provider.getFilterValue(newValue)
  const items = getFilteredItems(state, newPicks, filterValue)
  const focusedIndex = items.length === 0 ? -1 : 0
  return {
    ...state,
    value: newValue,
    picks: newPicks,
    items,
    focusedIndex,
    cursorOffset,
  }
}

export const handleBeforeInput = (
  state,
  inputType,
  data,
  selectionStart,
  selectionEnd
) => {
  Assert.string(inputType)
  Assert.number(selectionStart)
  Assert.number(selectionEnd)
  const { value } = state
  const { newValue, cursorOffset } = BeforeInput.getNewValue(
    value,
    inputType,
    data,
    selectionStart,
    selectionEnd
  )
  return handleInput(state, newValue, cursorOffset)
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

export const handleClickAt = (state, x, y) => {
  const { top, headerHeight, itemHeight } = state
  const relativeY = y - top - headerHeight
  const index = Math.floor(relativeY / itemHeight)
  return selectIndex(state, index)
}

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setValue',
      /* value */ newState.value,
    ]
  },
}

const renderCursorOffset = {
  isEqual(oldState, newState) {
    oldState.cursorOffset === newState.cursorOffset ||
      newState.cursorOffset === newState.value.length
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setCursorOffset',
      /* cursorOffset */ newState.cursorOffset,
    ]
  },
}

const getItemDomChanges = (oldState, newState) => {
  const oldItems = oldState.items
  const newItems = newState.items
  const length = oldItems.length
  const domChanges = []
  for (let i = 0; i < length; i++) {
    const oldItem = oldItems[i]
    const newItem = newItems[i]
    if (oldItem.icon && !newItem.icon) {
      domChanges.push({
        command: 'addIcon',
        icon: newItem.icon,
        index: i,
      })
    }
  }
  return domChanges
}

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    if (newState.items.length === 0) {
      return [
        /* Viewlet.send */ 'Viewlet.send',
        /* id */ 'QuickPick',
        /* method */ 'showNoResults',
      ]
    }
    const visibleItems = getVisible(
      newState.items,
      newState.minLineY,
      newState.maxLineY
    )
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setVisiblePicks',
      /* visiblePicks */ visibleItems,
    ]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.focusedIndex - oldState.minLineY
    const newFocusedIndex = newState.focusedIndex - newState.minLineY
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldFocusedIndex,
      /* newFocusedIndex */ newFocusedIndex,
    ]
  },
}

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {
    const maxLineY = Math.min(newState.maxLineY, newState.items.length)
    const itemCount = maxLineY - newState.minLineY
    const height = itemCount * newState.itemHeight
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setItemsHeight',
      /* height */ height,
    ]
  },
}

export const render = [
  renderItems,
  renderValue,
  renderCursorOffset,
  renderFocusedIndex,
  renderHeight,
]

export * from '../VirtualList/VirtualList.js'
