import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js' // TODO use Command.execute instead
import * as Height from '../Height/Height.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletSize from '../ViewletSize/ViewletSize.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as ViewletExtensionsHandleInput from './ViewletExtensionsHandleInput.js'
import { getListHeight } from './ViewletExtensionsShared.js'

const SUGGESTIONS = ['@builtin', '@disabled', '@enabled', '@installed', '@outdated', '@sort:installs', '@id:', '@category']

// then state can be recycled by Viewlet when there is only a single ViewletExtensions instance

export const saveState = (state) => {
  const { searchValue } = state
  return {
    searchValue,
  }
}

export const create = (id, uri, x, y, width, height) => {
  return {
    searchValue: '',
    suggestionState: /* Closed */ 0,
    disposed: false,
    width,
    height,
    handleOffset: 0,
    x,
    y,
    message: '',
    focused: false,
    size: ViewletSize.None,
    ...VirtualList.create({
      itemHeight: Height.ExtensionListItem,
      minimumSliderSize: Height.MinimumSliderSize,
      headerHeight: 35,
    }),
    allExtensions: [],
  }
}

const getVisible = (state) => {
  const { minLineY, maxLineY, items, itemHeight } = state
  const setSize = items.length
  const visible = []
  for (let i = minLineY; i < maxLineY; i++) {
    const item = items[i]
    visible.push({ ...item, setSize, posInSet: i + 1, top: i * itemHeight })
  }
  return visible
}

const getSize = (width) => {
  return width < 180 ? ViewletSize.Small : ViewletSize.Normal
}

const getSavedValue = (savedState) => {
  if (savedState && savedState.searchValue) {
    return savedState.searchValue
  }
  return ''
}

export const loadContent = async (state, savedState) => {
  const { width } = state
  const searchValue = getSavedValue(savedState)
  // TODO just get local extensions on demand (not when query string is already different)
  const allExtensions = await ExtensionManagement.getAllExtensions()
  const size = getSize(width)
  return ViewletExtensionsHandleInput.handleInput({ ...state, allExtensions, size }, searchValue)
  // TODO get installed extensions from extension host
  // TODO just get local extensions on demand (not when query string is already different)
}

export const dispose = () => {}

// TODO lazyload this

// TODO show error / warning  when installment fails / times out
export const handleInstall = async (state, id) => {
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'installing'
  )
  try {
    await ExtensionManagement.install(/* id */ id)
  } catch (error) {
    // TODO have multi send command
    await RendererProcess.invoke(
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'uninstalled'
    )
    // TODO use command.execute
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'installed'
  )
}

// TODO lazyload this
export const handleUninstall = async (state, id) => {
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'uninstalling'
  )
  try {
    await ExtensionManagement.uninstall(id)
  } catch (error) {
    await RendererProcess.invoke(
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'installed'
    )
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'uninstalled'
  )
}

// TODO lazyload this
export const handleEnable = async (state, id) => {
  try {
    await ExtensionManagement.enable(id)
  } catch (error) {
    await RendererProcess.invoke(
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'disabled'
    )
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'enabled'
  )
}

// TODO lazyload this
export const handleDisable = async (state, id) => {
  try {
    await ExtensionManagement.disable(id)
  } catch (error) {
    console.error(error)
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'disabled'
  )
}

export const openSuggest = async (state) => {
  const filteredSuggestions = SUGGESTIONS
  state.suggestionState = /* Open */ 1
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'openSuggest',
    /* suggestions */ filteredSuggestions
  )
}

export const closeSuggest = async (state) => {
  state.suggestionState = /* Closed */ 0
  await RendererProcess.invoke(/* viewletSend */ 'Viewlet.send', /* id */ ViewletModuleId.Extensions, /* method */ 'closeSuggest')
}

export const toggleSuggest = async (state) => {
  switch (state.suggestionState) {
    case /* Closed */ 0:
      await openSuggest(state)
      break
    case /* Open */ 1:
      await closeSuggest(state)
      break
    default:
      break
  }
}

export const handleBlur = (state) => {
  return {
    ...state,
    focused: false,
  }
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const { itemHeight, minLineY } = state
  // TODO should just return new state, render function can take old state and new state and return render commands
  const listHeight = getListHeight({ ...state, ...dimensions })
  const maxLineY = minLineY + Math.ceil(listHeight / itemHeight)
  const size = getSize(dimensions.width)
  return {
    ...state,
    ...dimensions,
    maxLineY,
    size,
  }
}

export const hasFunctionalRender = true

const renderExtensions = {
  isEqual(oldState, newState) {
    return oldState.items === newState.items && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    // TODO render extensions incrementally when scrolling
    const visibleExtensions = getVisible(newState)
    return [/* method */ 'setExtensions', /* visibleExtensions */ visibleExtensions]
  },
}

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {
    const { itemHeight } = newState
    const contentHeight = newState.items.length * itemHeight
    return [/* method */ 'setContentHeight', /* contentHeight */ contentHeight]
  },
}

const renderNegativeMargin = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY
  },
  apply(oldState, newState) {
    return [/* method */ 'setNegativeMargin', /* negativeMargin */ -newState.deltaY]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex && oldState.minLineY === newState.minLineY
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.focusedIndex - oldState.minLineY
    const newFocusedIndex = newState.focusedIndex - newState.minLineY
    return [
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldFocusedIndex,
      /* newFocusedIndex */ newFocusedIndex,
      /* focused */ newState.focused,
    ]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return (
      oldState.negativeMargin === newState.negativeMargin &&
      oldState.deltaY === newState.deltaY &&
      oldState.height === newState.height &&
      oldState.finalDeltaY === newState.finalDeltaY
    )
  },
  apply(oldState, newState) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      newState.scrollBarHeight
    )
    return [/* method */ 'setScrollBar', /* scrollBarY */ scrollBarY, /* scrollBarHeight */ newState.scrollBarHeight]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* method */ 'setMessage', /* message */ newState.message]
  },
}

const renderSize = {
  isEqual(oldState, newState) {
    return oldState.size === newState.size
  },
  apply(oldState, newState) {
    return [/* method */ 'setSize', /* oldSize */ oldState.size, /* newSize */ newState.size]
  },
}

const renderSearchValue = {
  isEqual(oldState, newState) {
    return oldState.searchValue === newState.searchValue
  },
  apply(oldState, newState) {
    return [/* method */ 'setSearchValue', oldState.searchValue, newState.searchValue]
  },
}

export const render = [
  renderHeight,
  renderFocusedIndex,
  renderScrollBar,
  renderNegativeMargin,
  renderMessage,
  renderExtensions,
  renderSize,
  renderSearchValue,
]
