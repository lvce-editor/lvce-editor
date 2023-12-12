import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.js'
import * as GetStatusBarItems from '../GetStatusBarItems/GetStatusBarItems.js'
import * as Preferences from '../Preferences/Preferences.js'

export const create = () => {
  return {
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
  }
}

export const loadContent = async (state) => {
  const statusBarItemsPreference = Preferences.get('statusBar.itemsVisible') ?? false
  const statusBarItems = await GetStatusBarItems.getStatusBarItems(statusBarItemsPreference)
  return {
    ...state,
    statusBarItemsLeft: [...statusBarItems],
  }
}

export const updateStatusBarItems = async (state) => {
  const newState = await loadContent(state)
  return newState
}

export const contentLoadedEffects = (state) => {
  // TODO dispose listener
  const handleChange = async () => {
    if (state.disposed) {
      return
    }
    await updateStatusBarItems(state)
    console.log('status bar items changed')
  }
  // maybe return cleanup function from here like react hooks
  ExtensionHostStatusBarItems.onChange(handleChange)
}

const updateArray = (items, newItem) => {
  const index = getIndex(items, newItem)
  const before = items.slice(0, index)
  const after = items.slice(index + 1)
  return [...before, newItem, ...after]
}

export const itemLeftCreate = (state, name, text, tooltip) => {
  const newItem = {
    name,
    text,
    tooltip,
  }
  const statusBarItemsLeft = [...state.statusBarItemsLeft, newItem]
  return {
    ...state,
    statusBarItemsLeft,
  }
}

const getIndex = (items, item) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name === item.name) {
      return i
    }
  }
  return -1
}

export const itemLeftUpdate = (state, newItem) => {
  return {
    ...state,
    statusBarItemsLeft: updateArray(state.statusBarItemsLeft, newItem),
  }
}

export const itemRightCreate = (state, newItem) => {
  const statusBarItemsRight = [...state.statusBarItemsRight, newItem]
  return {
    ...state,
    statusBarItemsRight,
  }
}

export const itemRightUpdate = (state, newItem) => {
  return {
    ...state,
    statusBarItemsRight: updateArray(state.statusBarItemsRight, newItem),
  }
}

export const handleClick = (name) => {
  // sendExtensionWorker([/* statusBarItemHandleClick */ 7657, /* name */ name])
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}
