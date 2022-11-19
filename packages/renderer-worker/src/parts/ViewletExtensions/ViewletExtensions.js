import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionDisplay from '../ExtensionDisplay/ExtensionDisplay.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js' // TODO use Command.execute instead
import * as ExtensionsMarketplace from '../ExtensionMarketplace/ExtensionMarketplace.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletSize from '../ViewletSize/ViewletSize.js'
import { getListHeight } from './ViewletExtensionsShared.js'
import * as Height from '../Height/Height.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as SearchExtensions from '../SearchExtensions/SearchExtensions.js'

const SUGGESTIONS = [
  '@builtin',
  '@disabled',
  '@enabled',
  '@installed',
  '@outdated',
  '@sort:installs',
  '@id:',
  '@category',
]

// then state can be recycled by Viewlet when there is only a single ViewletExtensions instance

export const create = (id, uri, left, top, width, height) => {
  return {
    extensions: [],
    searchValue: '',
    suggestionState: /* Closed */ 0,
    disposed: false,
    width,
    height,
    handleOffset: 0,
    top,
    left,
    error: '',
    focused: false,
    size: ViewletSize.None,
    ...VirtualList.create({
      itemHeight: Height.ExtensionListItem,
      minimumSliderSize: Height.MinimumSliderSize,
      headerHeight: 35,
    }),
  }
}

const getVisible = (state) => {
  const { minLineY, maxLineY, items } = state
  return items.slice(minLineY, maxLineY)
}

const getSize = (width) => {
  return width < 180 ? ViewletSize.Small : ViewletSize.Normal
}

export const loadContent = async (state) => {
  const { height, itemHeight, minimumSliderSize, width, searchValue } = state
  // TODO just get local extensions on demand (not when query string is already different)

  const allExtensions = await ExtensionManagement.getAllExtensions()
  // TODO get installed extensions from extension host
  // TODO just get local extensions on demand (not when query string is already different)
  const extensions = await SearchExtensions.searchExtensions(
    allExtensions,
    searchValue
  )

  console.log({ extensions })

  const viewObjects = []
  // const viewObjects = filterExtensions(
  //   extensions.map(toInstalledViewObject),
  //   state.parsedValue,
  //   itemHeight
  // )

  const listHeight = getListHeight(state)
  const total = viewObjects.length
  const contentHeight = total * itemHeight
  const scrollBarHeight = ScrollBarFunctions.getScrollBarHeight(
    height,
    contentHeight,
    minimumSliderSize
  )
  const numberOfVisible = Math.ceil(listHeight / itemHeight)
  const maxLineY = Math.min(numberOfVisible, total)
  const finalDeltaY = Math.max(contentHeight - listHeight, 0)
  const size = getSize(width)
  return {
    ...state,
    extensions,
    items: viewObjects,
    maxLineY: maxLineY,
    scrollBarHeight,
    finalDeltaY,
    size,
  }
}

export const dispose = () => {}

// TODO debounce
export const handleInput = async (state, value) => {
  try {
    const { itemHeight, extensions } = state
    // TODO cancel ongoing requests
    // TODO handle errors
    const filteredExtensions = await SearchExtensions.searchExtensions(
      extensions,
      value
    )
    const items = []
    return {
      ...state,
      extensions,
      items,
      minLineY: 0,
      deltaY: 0,
    }

    // TODO handle out of order responses (a bit complicated)
    // for now just assume everything comes back in order
  } catch (error) {
    ErrorHandling.printError(error)
    return {
      ...state,
      error: `Failed to load extensions from marketplace: ${error}`,
    }
  }
}

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

const handleContextMenuMouse = (state, x, y) => {}

const handleContextMenuIndex = (state, index) => {}

// TODO pass index instead
export const handleContextMenu = async (state, x, y, index) => {
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.ManageExtension
  )
  return state
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
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'closeSuggest'
  )
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
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    const visibleExtensions = getVisible(newState)
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setExtensions',
      /* visibleExtensions */ visibleExtensions,
    ]
  },
}

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {
    const { itemHeight } = newState
    const contentHeight = newState.items.length * itemHeight
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setContentHeight',
      /* contentHeight */ contentHeight,
    ]
  },
}

const renderNegativeMargin = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setNegativeMargin',
      /* negativeMargin */ -newState.deltaY,
    ]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return (
      oldState.focusedIndex === newState.focusedIndex &&
      oldState.minLineY === newState.minLineY
    )
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.focusedIndex - oldState.minLineY
    const newFocusedIndex = newState.focusedIndex - newState.minLineY
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
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
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setScrollBar',
      /* scrollBarY */ scrollBarY,
      /* scrollBarHeight */ newState.scrollBarHeight,
    ]
  },
}

const renderError = {
  isEqual(oldState, newState) {
    return oldState.error === newState.error
  },
  apply(oldState, newState) {
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setError',
      /* error */ newState.error,
    ]
  },
}

const renderSize = {
  isEqual(oldState, newState) {
    return oldState.size === newState.size
  },
  apply(oldState, newState) {
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setSize',
      /* oldSize */ oldState.size,
      /* newSize */ newState.size,
    ]
  },
}

export const render = [
  renderHeight,
  renderFocusedIndex,
  renderScrollBar,
  renderNegativeMargin,
  renderExtensions,
  renderError,
  renderSize,
]
