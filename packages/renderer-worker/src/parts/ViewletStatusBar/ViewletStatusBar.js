import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = () => {
  return {
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
  }
}

const toUiStatusBarItem = (extensionHostStatusBarItem) => {
  return {
    name: extensionHostStatusBarItem.id,
    text: extensionHostStatusBarItem.id,
    tooltip: '',
    command: -1,
    icon: extensionHostStatusBarItem.icon || '',
  }
}

const toUiStatusBarItems = (statusBarItems) => {
  if (!statusBarItems) {
    return []
  }
  return statusBarItems.map(toUiStatusBarItems)
}

export const loadContent = async (state) => {
  const extensionStatusBarItems =
    await ExtensionHostStatusBarItems.getStatusBarItems()

  const uiStatusBarItems = toUiStatusBarItems(extensionStatusBarItems)
  return {
    ...state,
    statusBarItemsLeft: [
      // {
      //   name: 'RunTests',
      //   text: 'Run Tests',
      //   tooltip: '',
      //   command: 909021,
      // },
      ...uiStatusBarItems,
    ],
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

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.statusBarItemsLeft === newState.statusBarItemsLeft &&
      oldState.statusBarItemsRight === newState.statusBarItemsRight
    )
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ ViewletModuleId.StatusBar,
      /* method */ 'setItems',
      /* statusBarItemsLeft */ newState.statusBarItemsLeft,
      /* statusBarItemsRight */ newState.statusBarItemsRight,
    ]
  },
}

export const render = [renderItems]
