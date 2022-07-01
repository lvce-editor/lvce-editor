import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.js'

export const name = 'Status Bar'

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

export const loadContent = async (state) => {
  const extensionStatusBarItems =
    await ExtensionHostStatusBarItems.getStatusBarItems()

  const uiStatusBarItems = extensionStatusBarItems.map(toUiStatusBarItem)
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

export const contentLoaded = async (state) => {}

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

export const resize = (state, dimensions) => {
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands: [],
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  if (
    oldState.statusBarItemsLeft !== newState.statusBarItemsLeft ||
    oldState.statusBarItemsRight !== newState.statusBarItemsRight
  ) {
    changes.push([
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'StatusBar',
      /* method */ 'setItems',
      /* statusBarItemsLeft */ newState.statusBarItemsLeft,
      /* statusBarItemsRight */ newState.statusBarItemsRight,
    ])
  }
  return changes
}
