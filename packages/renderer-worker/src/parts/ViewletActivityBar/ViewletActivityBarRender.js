import * as GetVisibleActivityBarItems from '../GetVisibleActivityBarItems/GetVisibleActivityBarItems.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

const renderActivityBarItems = {
  isEqual(oldState, newState) {
    return oldState.activityBarItems === newState.activityBarItems && oldState.height === newState.height
  },
  apply(oldState, newState) {
    const visibleItems = GetVisibleActivityBarItems.getVisibleActivityBarItems(newState)
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
