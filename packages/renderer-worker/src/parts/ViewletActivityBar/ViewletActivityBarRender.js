import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActvityBarItemFlags.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { h } from '../VirtualDomHelpers/VirtualDomHelpers.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Explorer: 'Explorer',
  Search: 'Search',
  SourceControl: 'Source Control',
  RunAndDebug: 'Run and Debug',
  Extensions: 'Extensions',
  Settings: 'Settings',
  AdditionalViews: 'Additional Views',
  ActivityBar: 'Activity Bar',
}

/**
 * @enum {string}
 */
const ClassNames = {
  ActivityBarItem: 'ActivityBarItem',
  ActivityBarItemIcon: 'ActivityBarItemIcon',
}

/**
 * @enum {string}
 */
const Ids = {
  ActivityBar: 'ActivityBar',
}

/**
 * @enum {string}
 */
const Roles = {
  ToolBar: 'toolbar',
  Tab: 'tab',
  Button: 'button',
}

// TODO rename viewlet parameter to something else (e.g. clicking settings opens context menu not settings viewlet)
// TODO should just pass index
// then if item is viewlet -> open viewlet
// else if item is settings -> open settings

// TODO this should be create
// TODO unregister listeners when hidden

const getNumberOfVisibleItems = (state) => {
  const { height, itemHeight } = state
  const numberOfVisibleItemsTop = Math.floor(height / itemHeight)
  return numberOfVisibleItemsTop
}

export const getHiddenItems = (state) => {
  const numberOfVisibleItems = getNumberOfVisibleItems(state)
  const items = state.activityBarItems
  if (numberOfVisibleItems >= items.length) {
    return []
  }
  return state.activityBarItems.slice(numberOfVisibleItems - 2, -1)
}

const getVisibleActivityBarItems = (state) => {
  const numberOfVisibleItems = getNumberOfVisibleItems(state)
  const items = state.activityBarItems
  if (numberOfVisibleItems >= items.length) {
    return items
  }
  const showMoreItem = {
    id: 'Additional Views',
    title: I18nString.i18nString(UiStrings.AdditionalViews),
    icon: 'icons/ellipsis.svg',
    enabled: true,
    flags: ActivityBarItemFlags.Button,
    keyShortCuts: '',
  }
  const visibleItems = [
    ...items.slice(0, numberOfVisibleItems - 2),
    showMoreItem,
    items.at(-1),
  ]
  return visibleItems
}

const getActivityBarItemProps = (item) => {
  switch (item.flags) {
    case ActivityBarItemFlags.Tab:
      return {
        className: ClassNames.ActivityBarItem,
        ariaLabel: '', // aria-label is determined by content  TODO is empty aria-label necessary or can it be left off?
        title: item.id,
        tabindex: -1,
        role: Roles.Tab,
        ariaSelected: item.selected,
      }
    case ActivityBarItemFlags.Button:
      return {
        className: ClassNames.ActivityBarItem,
        ariaLabel: '',
        title: item.id,
        tabindex: -1,
        role: Roles.Button,
        ariaSelected: item.selected,
        ariaHasPopup: true,
      }
    default:
      return {}
  }
}

const getActivityBarItemDom = (item) => {
  const activityBarItemProps = getActivityBarItemProps(item)
  return [
    h(VirtualDomElements.Div, activityBarItemProps, 1),
    h(
      VirtualDomElements.Div,
      {
        className: ClassNames.ActivityBarItemIcon,
        style: `-webkit-mask-image: url("${item.icon}")`,
      },
      0
    ),
  ]
}

const getDomItems = (items, focusedIndex, selectedIndex) => {
  const domItems = []
  for (const item of items) {
    domItems.push({
      flags: item.flags,
      icon: item.icon,
      id: item.id,
      keyShortcuts: item.keyShortCuts,
      title: item.title,
      selected: false,
      focused: false,
    })
  }
  if (focusedIndex !== -1) {
    domItems[focusedIndex].focused = true
  }
  if (selectedIndex !== -1) {
    domItems[selectedIndex].selected = true
  }
  return domItems
}

const getActivityBarDom = (domItems) => {
  const itemsLength = domItems.length
  return [
    h(
      VirtualDomElements.Div,
      {
        id: Ids.ActivityBar,
        role: Roles.ToolBar,
        ariaLabel: UiStrings.ActivityBar,
        ariaOrientation: 'vertical',
      },
      itemsLength
    ),
    ...domItems.flatMap(getActivityBarItemDom),
  ]
}

const renderActivityBarItems = {
  isEqual(oldState, newState) {
    return (
      oldState.activityBarItems === newState.activityBarItems &&
      oldState.focusedIndex === newState.focusedIndex &&
      oldState.selectedIndex === newState.selectedIndex &&
      oldState.height === newState.height
    )
  },
  apply(oldState, newState) {
    const visibleItems = getVisibleActivityBarItems(newState)
    const { focusedIndex, selectedIndex } = newState
    console.log('selected', selectedIndex)
    const domItems = getDomItems(visibleItems, focusedIndex, selectedIndex)
    const dom = getActivityBarDom(domItems)
    console.log({ domItems })
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ActivityBar',
      /* method */ 'setDom',
      /* dom */ dom,
    ]
  },
}

export const render = [renderActivityBarItems]

export const hasFunctionalRender = true
