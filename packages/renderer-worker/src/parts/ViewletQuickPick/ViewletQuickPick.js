import * as Assert from '../Assert/Assert.js'
import * as Height from '../Height/Height.js'
import * as QuickPickEntries from '../QuickPickEntries/QuickPickEntries.js'
import * as QuickPickEveryThing from '../QuickPickEntriesEverything/QuickPickEntriesEverything.js'
import * as QuickPickReturnValue from '../QuickPickReturnValue/QuickPickReturnValue.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as ViewletQuickPickGetFilteredItems from './ViewletQuickPickGetFilteredItems.js'

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

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    state: QuickPickState.Default,
    picks: [],
    recentPicks: [],
    recentPickIds: new Map(), // TODO use object.create(null) instead
    versionId: 0,
    provider: QuickPickEveryThing, // TODO make this dynamic again
    warned: [],
    visiblePicks: [],
    maxVisibleItems: 10,
    uri,
    cursorOffset: 0,
    height: 300,
    top: 50,
    width: 600,
    ...VirtualList.create({
      itemHeight: Height.ListItem,
      headerHeight: 30,
      minimumSliderSize: Height.MinimumSliderSize,
    }),
  }
}

// TODO naming for provider.getNoResults is a bit weird

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
  const items = ViewletQuickPickGetFilteredItems.getFilteredItems(state, newPicks, filterValue, provider)
  const placeholder = provider.getPlaceholder()
  // @ts-ignore
  const label = provider.getLabel()
  const minLineY = 0
  const maxLineY = Math.min(minLineY + state.maxVisibleItems, newPicks.length - 1)
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

export const dispose = (state) => {
  return state
}

export const handleBlur = async (state) => {
  await Viewlet.closeWidget(state.uid)
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
      await Viewlet.closeWidget(state.uid)
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

export * from '../VirtualList/VirtualList.js'
