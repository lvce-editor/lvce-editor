import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as Icon from '../Icon/Icon.js'
import { getNumberOfVisibleItems } from './ViewletActivityBarGetHiddenItems.js'
import * as ViewletActivityBarStrings from './ViewletActivityBarStrings.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

const getVisibleActivityBarItems = (state) => {
  const numberOfVisibleItems = getNumberOfVisibleItems(state)
  const items = state.activityBarItems
  if (numberOfVisibleItems >= items.length) {
    return items
  }
  const showMoreItem = {
    id: 'Additional Views',
    title: ViewletActivityBarStrings.additionalViews(),
    icon: Icon.Ellipsis,
    enabled: true,
    flags: ActivityBarItemFlags.Button,
    keyShortCuts: '',
  }
  const visibleItems = [...items.slice(0, numberOfVisibleItems - 2), showMoreItem, items.at(-1)]
  return visibleItems
}

const renderActivityBarItems = {
  isEqual(oldState, newState) {
    return oldState.activityBarItems === newState.activityBarItems && oldState.height === newState.height
  },
  apply(oldState, newState) {
    const visibleItems = getVisibleActivityBarItems(newState)
    return [/* method */ RenderMethod.SetItems, /* items */ visibleItems]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex && oldState.focused === newState.focused
  },
  apply(oldState, newState) {
    return [
      /* method */ RenderMethod.SetFocusedIndex,
      /* unFocusIndex */ oldState.focusedIndex,
      /* focusIndex */ newState.focusedIndex,
      /* focused */ newState.focused,
    ]
  },
}

const renderSelectedIndex = {
  isEqual(oldState, newState) {
    return oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetSelectedIndex, /* oldIndex */ oldState.selectedIndex, /* newIndex */ newState.selectedIndex]
  },
}

export const render = [renderActivityBarItems, renderFocusedIndex, renderSelectedIndex]

export const hasFunctionalRender = true
