import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js' // TODO use Command.execute instead
import * as ExtensionsMarketplace from '../ExtensionMarketplace/ExtensionMarketplace.js'
import * as Platform from '../Platform/Platform.js'
import * as Assert from '../Assert/Assert.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import {
  getListHeight,
  HEADER_HEIGHT,
  ITEM_HEIGHT,
  MINIMUM_SLIDER_SIZE,
} from './ViewletExtensionsShared.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

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

export const name = 'Extensions'

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
    finalDeltaY: 2728,
    error: '',
    touchOffsetY: 0,
    touchTimeStamp: 0,
    touchDifference: 0,
  }
}

const getVisible = (state) => {
  return state.filteredExtensions.slice(state.minLineY, state.maxLineY)
}

export const loadContent = async (state) => {
  // TODO just get local extensions on demand (not when query string is already different)

  // TODO get installed extensions from extension host
  // TODO just get local extensions on demand (not when query string is already different)
  const extensions = await ExtensionManagement.getAllExtensions()
  const viewObjects = filterExtensions(
    extensions.map(toInstalledViewObject),
    state.parsedValue
  )

  const listHeight = getListHeight(state)
  const contentHeight = viewObjects.length * ITEM_HEIGHT
  const scrollBarHeight = getScrollBarHeight(state.height, contentHeight)

  console.log({ extensions })
  return {
    ...state,
    extensions,
    filteredExtensions: viewObjects,
    maxLineY: Math.round(listHeight / ITEM_HEIGHT),
    scrollBarHeight,
  }
}

export const contentLoaded = async (state) => {
  // if (state.searchValue === '') {
  //   const visible = getVisible(state)
  //   await RendererProcess.invoke(
  //     /* Viewlet.invoke */ 'Viewlet.send',
  //     /* id */ 'Extensions',
  //     /* method */ 'setExtensions',
  //     /* viewObjects */ visible,
  //     /* negativeMargin */ -state.deltaY
  //   )
  //   return
  // }
  // await RendererProcess.invoke(
  //   /* Viewlet.invoke */ 'Viewlet.send',
  //   /* id */ 'Extensions',
  //   /* method */ 'setExtensions',
  //   /* viewObjects */ [],
  //   /* negativeMargin */ 0
  // )
}

const RE_PUBLISHER = /^[a-z\d\-]+/

// TODO handle case when extension is of type number|array|null|string
const getPublisher = (extension) => {
  if (!extension || !extension.id) {
    return 'n/a'
  }
  // TODO handle case when id is not of type string -> should not crash application
  const match = extension.id.match(RE_PUBLISHER)
  if (!match) {
    return 'n/a'
  }
  return match[0]
}

// TODO all icon related logic should be here, not in renderer process
const getIcon = (extension) => {
  if (!extension || !extension.path || !extension.icon) {
    return ''
  }
  if (Platform.platform === 'remote') {
    return `/remote/${extension.path}/${extension.icon}` // TODO support windows paths
  }
  if (Platform.platform === 'electron') {
    return `/remote/${extension.path}/${extension.icon}` // TODO support windows paths
  }
  return ''
}

const getName = (extension) => {
  if (extension && extension.name) {
    return extension.name
  }
  if (extension && extension.id) {
    return extension.id
  }
  return 'n/a'
}

const getVersion = (extension) => {
  if (!extension || !extension.version) {
    return 'n/a'
  }
  return extension.version
}

const getDescription = (extension) => {
  if (!extension || !extension.description) {
    return 'n/a'
  }
  return extension.description
}

const getId = (extension) => {
  if (!extension || !extension.id) {
    return 'n/a'
  }
  return extension.id
}

const toInstalledViewObject = (extension) => {
  return {
    name: getName(extension),
    publisher: getPublisher(extension),
    version: getVersion(extension),
    description: getDescription(extension),
    // TODO type field: builtin|marketplace|external
    // TODO should be status
    state: 'installed',
    id: getId(extension),
    icon: getIcon(extension),
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

const filterExtensions = (extensions, parsedValue) => {
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
    filteredExtensions[i].top = i * ITEM_HEIGHT
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
    const filteredExtensions = filterExtensions(extensions, parsedValue)
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

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  // TODO should just return new state, render function can take old state and new state and return render commands
  const listHeight = getListHeight(dimensions)
  const maxLineY = state.minLineY + Math.ceil(listHeight / ITEM_HEIGHT)
  return {
    ...state,
    ...dimensions,
    maxLineY,
  }
}

export const setDeltaY = (state, deltaY) => {
  Assert.object(state)
  Assert.number(deltaY)
  const listHeight = getListHeight(state)
  if (deltaY < 0) {
    deltaY = 0
  } else if (
    deltaY >
    state.filteredExtensions.length * ITEM_HEIGHT - listHeight
  ) {
    deltaY = Math.max(
      state.filteredExtensions.length * ITEM_HEIGHT - listHeight,
      0
    )
  }
  if (state.deltaY === deltaY) {
    return state
  }
  console.trace('set', deltaY)
  // TODO when it only moves by one px, extensions don't need to be rerendered, only negative margin
  const minLineY = Math.floor(deltaY / ITEM_HEIGHT)
  const maxLineY = minLineY + Math.round(listHeight / ITEM_HEIGHT)
  const negativeMargin = -Math.round(deltaY)
  return {
    ...state,
    deltaY,
    minLineY,
    maxLineY,
    negativeMargin,
  }
  // await scheduleExtensions(state)
}

export const handleWheel = (state, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
}

const getScrollBarHeight = (editorHeight, contentHeight) => {
  if (editorHeight > contentHeight) {
    return 0
  }
  return Math.max(
    Math.round(editorHeight ** 2 / contentHeight),
    MINIMUM_SLIDER_SIZE
  )
}

const getNewPercent = (state, relativeY) => {
  if (relativeY <= state.height - state.scrollBarHeight / 2) {
    // clicked in middle
    return relativeY / (state.height - state.scrollBarHeight)
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarMove = (state, y) => {
  const relativeY = y - state.top - HEADER_HEIGHT - state.handleOffset
  console.log('handle offset', state.handleOffset)
  const newPercent = getNewPercent(state, relativeY)
  const newDeltaY = newPercent * state.finalDeltaY
  console.log({ relativeY, newPercent, newDeltaY })
  return setDeltaY(state, newDeltaY)
}

const getNewDeltaPercent = (state, relativeY) => {
  if (relativeY <= state.scrollBarHeight / 2) {
    // clicked at top
    return 0
  }
  if (relativeY <= state.height - state.scrollBarHeight / 2) {
    // clicked in middle
    return (
      (relativeY - state.scrollBarHeight / 2) /
      (state.height - state.scrollBarHeight)
    )
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarClick = (state, y) => {
  const relativeY = y - state.top - HEADER_HEIGHT
  const newPercent = getNewDeltaPercent(state, relativeY)
  console.log({
    relativeY,
    top: state.top,
    headerHeight: HEADER_HEIGHT,
    newPercent,
  })
  const newDeltaY = newPercent * state.finalDeltaY

  return {
    ...setDeltaY(state, newDeltaY),
    handleOffset: state.scrollBarHeight / 2,
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
    const contentHeight = newState.filteredExtensions.length * ITEM_HEIGHT
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
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Extensions',
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldState.focusedIndex - oldState.minLineY,
      /* newFocusedIndex */ newState.focusedIndex - newState.minLineY,
    ]
  },
}

const renderScrollBarY = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY
  },
  apply(oldState, newState) {
    console.log('deltay', newState.deltaY)
    const scrollBarY =
      (newState.deltaY / newState.finalDeltaY) *
      (newState.height - newState.scrollBarHeight)
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

export const render = [
  renderHeight,
  renderFocusedIndex,
  renderScrollBarY,
  renderNegativeMargin,
  renderExtensions,
  renderError,
]
