import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionDisplay from '../ExtensionDisplay/ExtensionDisplay.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js' // TODO use Command.execute instead
import * as ExtensionsMarketplace from '../ExtensionMarketplace/ExtensionMarketplace.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import { getListHeight } from './ViewletExtensionsShared.js'

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

export const name = ViewletModuleId.Extensions

// then state can be recycled by Viewlet when there is only a single ViewletExtensions instance

export const create = (id, uri, left, top, width, height) => {
  return {
    extensions: [],
    filteredExtensions: [],
    searchValue: '',
    parsedValue: {
      isLocal: true, // TODO flatten this
      query: '',
    },
    suggestionState: /* Closed */ 0,
    disposed: false,
    focusedIndex: -1,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    width,
    height,
    negativeMargin: 0,
    scrollBarHeight: 0,
    handleOffset: 0,
    top,
    left,
    finalDeltaY: 0,
    error: '',
    touchOffsetY: 0,
    touchTimeStamp: 0,
    touchDifference: 0,
    itemHeight: 62,
    headerHeight: 35,
    minimumSliderSize: 20,
    focused: false,
  }
}

const getVisible = (state) => {
  const { minLineY, maxLineY } = state
  return state.filteredExtensions.slice(minLineY, maxLineY)
}

const getSize = (width) => {
  return width < 180 ? 'Small' : 'Normal'
}

export const loadContent = async (state) => {
  const { height, itemHeight, minimumSliderSize, width } = state
  // TODO just get local extensions on demand (not when query string is already different)

  // TODO get installed extensions from extension host
  // TODO just get local extensions on demand (not when query string is already different)
  const extensions = await ExtensionManagement.getAllExtensions()
  const viewObjects = filterExtensions(
    extensions.map(toInstalledViewObject),
    state.parsedValue,
    itemHeight
  )

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
  const finalY = Math.max(total - numberOfVisible, 0)
  const finalDeltaY = contentHeight - listHeight
  const size = getSize(width)
  return {
    ...state,
    extensions,
    filteredExtensions: viewObjects,
    maxLineY: maxLineY,
    scrollBarHeight,
    finalDeltaY,
    size,
  }
}

const toInstalledViewObject = (extension) => {
  return {
    name: ExtensionDisplay.getName(extension),
    publisher: ExtensionDisplay.getPublisher(extension),
    version: ExtensionDisplay.getVersion(extension),
    description: ExtensionDisplay.getDescription(extension),
    // TODO type field: builtin|marketplace|external
    // TODO should be status
    state: 'installed',
    id: ExtensionDisplay.getId(extension),
    icon: ExtensionDisplay.getIcon(extension),
  }
}

const toDisabledViewObject = (extension) => {
  return {
    name: extension.name,
    publisher: extension.authorId || extension.publisher,
    version: extension.version,
    // TODO type field: builtin|marketplace|external
    // TODO should be status
    state: 'disabled',
    id: extension.id,
  }
}

export const dispose = () => {}

const RE_PARAM = /@\w+/g

// TODO test sorting and filtering
const parseValue = (value) => {
  const parameters = Object.create(null)
  // TODO this is not very functional code (assignment)
  const replaced = value.replace(RE_PARAM, (match, by, order) => {
    if (match.startsWith('@installed')) {
      parameters.installed = true
    }
    if (match.startsWith('@enabled')) {
      parameters.enabled = true
    }
    if (match.startsWith('@disabled')) {
      parameters.disabled = true
    }
    if (match.startsWith('@builtin')) {
      parameters.builtin = true
    }
    if (match.startsWith('@sort')) {
      // TODO
      parameters.sort = 'installs'
    }
    if (match.startsWith('@id')) {
      // TODO
      parameters.id = 'abc'
    }
    if (match.startsWith('@outdated')) {
      parameters.outdated = true
    }
    return ''
  })
  const isLocal =
    parameters.enabled ||
    parameters.builtin ||
    parameters.disabled ||
    parameters.outdated
  return {
    query: replaced,
    isLocal,
    params: parameters,
  }
}

const matchesParsedValue = (extension, parsedValue) => {
  // TODO handle error when extension.name is not of type string
  if (extension && extension.name) {
    return extension.name.includes(parsedValue.query)
  }
  // TODO handle error when extension id is not of type string
  if (extension && extension.id) {
    return extension.id.includes(parsedValue.query)
  }
  return false
}

const filterExtensions = (extensions, parsedValue, itemHeight) => {
  const filteredExtensions = []
  for (const extension of extensions) {
    if (matchesParsedValue(extension, parsedValue)) {
      filteredExtensions.push(extension)
    }
  }
  // TODO make this more efficient / more functional
  for (let i = 0; i < filteredExtensions.length; i++) {
    filteredExtensions[i].setSize = filteredExtensions.length
    filteredExtensions[i].posInSet = i + 1
    filteredExtensions[i].top = i * itemHeight
  }
  return filteredExtensions
}

const getExtensionsLocal = (parsedValue) => {
  // TODO get local extensions from shared process
  // return state.localExtensions
  return []
}

const getExtensionsMarketplace = (parsedValue) => {
  return ExtensionsMarketplace.getMarketplaceExtensions({
    q: parsedValue.query,
    ...parsedValue.params,
  })
}

const getExtensions = (parsedValue) => {
  if (parsedValue.isLocal) {
    return getExtensionsLocal(parsedValue)
  }
  return getExtensionsMarketplace(parsedValue)
}

const toUiExtension = (extension, index) => {
  return {
    name: extension.name,
    authorId: extension.authorId,
    version: extension.version,
    id: extension.id,
  }
}

const toDisplayExtensions = (extensions) => {
  const toDisplayExtension = (extension, index) => {
    return {
      name: extension.name,
      posInSet: index + 1,
      setSize: extensions.length,
    }
  }
  return extensions.map(toDisplayExtension)
}

// TODO debounce
export const handleInput = async (state, value) => {
  try {
    // TODO make this functional somehow
    state.searchValue = value
    const { itemHeight } = state
    // TODO cancel ongoing requests
    // TODO handle errors
    const parsedValue = parseValue(value)
    // TODO let not good here, error handling should be automatic,
    // exceptions handled by supervisor
    const extensions = await getExtensions(parsedValue)

    // TODO race condition: viewlet might already be disposed after this

    if (state.searchValue !== value) {
      return state
    }
    const filteredExtensions = filterExtensions(
      extensions,
      parsedValue,
      itemHeight
    )
    const displayExtensions = toDisplayExtensions(filteredExtensions)
    return {
      ...state,
      extensions,
      filteredExtensions,
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
    /* id */ 'Extensions',
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
      /* id */ 'Extensions',
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
    /* id */ 'Extensions',
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'installed'
  )
}

// TODO lazyload this
export const handleUninstall = async (state, id) => {
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ 'Extensions',
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'uninstalling'
  )
  try {
    await ExtensionManagement.uninstall(id)
  } catch (error) {
    await RendererProcess.invoke(
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'Extensions',
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'installed'
    )
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ 'Extensions',
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
      /* id */ 'Extensions',
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'disabled'
    )
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ 'Extensions',
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
    /* id */ 'Extensions',
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
    /* id */ 'Extensions',
    /* method */ 'openSuggest',
    /* suggestions */ filteredSuggestions
  )
}

export const closeSuggest = async (state) => {
  state.suggestionState = /* Closed */ 0
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ 'Extensions',
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
      oldState.filteredExtensions === newState.filteredExtensions &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    const visibleExtensions = getVisible(newState)
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Extensions',
      /* method */ 'setExtensions',
      /* visibleExtensions */ visibleExtensions,
    ]
  },
}

const renderHeight = {
  isEqual(oldState, newState) {
    return (
      oldState.filteredExtensions.length === newState.filteredExtensions.length
    )
  },
  apply(oldState, newState) {
    const { itemHeight } = newState
    const contentHeight = newState.filteredExtensions.length * itemHeight
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Extensions',
      /* method */ 'setContentHeight',
      /* contentHeight */ contentHeight,
    ]
  },
}

const renderNegativeMargin = {
  isEqual(oldState, newState) {
    return oldState.negativeMargin === newState.negativeMargin
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Extensions',
      /* method */ 'setNegativeMargin',
      /* negativeMargin */ newState.negativeMargin,
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
      /* id */ 'Extensions',
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldFocusedIndex,
      /* newFocusedIndex */ newFocusedIndex,
      /* focused */ newState.focused,
    ]
  },
}

const renderScrollBarY = {
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
    console.log('render scrollbar', {
      scrollBarY,
      deltaY: newState.deltaY,
      negative: newState.negativeMargin,
      finalDeltaY: newState.finalDeltaY,
    })
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Extensions',
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
      /* id */ 'Extensions',
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
      /* id */ 'Extensions',
      /* method */ 'setSize',
      /* size */ newState.size,
    ]
  },
}

export const render = [
  renderHeight,
  renderFocusedIndex,
  renderScrollBarY,
  renderNegativeMargin,
  renderExtensions,
  renderError,
  renderSize,
]
